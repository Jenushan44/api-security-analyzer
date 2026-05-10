from fastapi import FastAPI 
import requests
from schemas import ScanRequest
from scanner.rules import security_header
from scanner.findings import add_finding
from scanner.sensitive_data import scan_sensitive_keys
from scanner.risk import calculate_risk
from scanner.errors import build_error_response
from scanner.rate_limit import check_rate_limiting
from scanner.auth_exposure import check_auth_exposure
from scanner.cors import check_cors
from scanner.cookies import check_cookie_security
from database.save_scan import save_scan_result
from database.connection import SessionLocal
from database.models import Scan

app = FastAPI() 

@app.get("/") 
def root():
  return {"message": "Test"}

@app.get("/fake-user") 
def test(): 
  return {
    "credentials": {
      "password": "123",
    },
    "access_token": "test-token", 
    "username": "test-user",
  }

@app.post("/scan") 
def scan(data: ScanRequest):
  findings = []

  if data.url.startswith("https://") or data.url.startswith("http://"):
    try: 
      response = requests.get(data.url, timeout = 5)
    except requests.exceptions.Timeout: 
      return build_error_response("timeout", data.url)
    except requests.exceptions.ConnectionError: 
      return build_error_response("connection_error", data.url)
    except requests.exceptions.RequestException: 
      return build_error_response("request_error", data.url)
  else: 
    return build_error_response("invalid_url", data.url)

  for header in security_header:
    if header not in response.headers: 
      add_finding(findings, header)
  try: 
    response_data = response.json()
  except: 
    response_data = None

  check_cors(response.headers, findings)
  check_cookie_security(response.headers, findings)
  scan_sensitive_keys(response_data, findings)
  check_auth_exposure(response_data, response.status_code, findings )
  check_rate_limiting(data.url, findings)
  risk = calculate_risk(findings)
  scan_id = save_scan_result(data.url, response.status_code, risk, findings)

  return {
    "scan_id": scan_id,
    "target_url": data.url,
    "status_code": response.status_code,
    "headers": dict(response.headers), 
    "data": response_data,
    "findings": findings,
    "risk_score": risk["risk_score"], 
    "risk_level": risk["risk_level"], 
    "risk_summary": risk["risk_summary"], 
    "severity_counts": risk["severity_counts"], 
    "category_counts": risk["category_counts"],
  }

@app.get("/scans") 
def get_scans(): 
  scan_results = []
  db = SessionLocal()
  try: 
    scans = db.query(Scan).order_by(Scan.created_at.desc()).limit(20).all() 
    for scan in scans: 
      scan_dict = {"id": scan.id, "target_url": scan.target_url, "status_code": scan.status_code, "risk_score": scan.risk_score, "risk_level": scan.risk_level, "risk_summary": scan.risk_summary, "created_at": scan.created_at}
      scan_results.append(scan_dict)
  finally: 
    db.close()
  
  return scan_results