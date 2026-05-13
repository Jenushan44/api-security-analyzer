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
from database.models import Scan, Finding
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI() 
app.add_middleware(
  CORSMiddleware, 
  allow_origins = [  
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    ], 
  allow_credentials = True,   
  allow_methods = ["*"], 
  allow_headers = ["*"],
)

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

@app.get("/scans/{scan_id}")
def get_scan_report(scan_id: int): 
  db = SessionLocal()
  finding_list = []
  try: 
    scan_search = db.get(Scan, scan_id)    
    
    if scan_search == None: 
      return {
        "error": True, 
        "message": "Scan not found"
      }
    
    finding_search = db.query(Finding).filter(Finding.scan_id == scan_id).all()

    scan_dict = {"id": scan_search.id, "target_url": scan_search.target_url, "status_code": scan_search.status_code, "risk_score": scan_search.risk_score, "risk_level": scan_search.risk_level, "risk_summary": scan_search.risk_summary, "created_at": scan_search.created_at}

    for finding in finding_search: 
      finding_dict = {"id": finding.id, "scan_id": finding.scan_id, "title": finding.title, "severity": finding.severity, "category": finding.category, "evidence": finding.evidence, "recommendation": finding.recommendation}
      finding_list.append(finding_dict)

  finally: 
    db.close()

  return {
    "scan": scan_dict,
    "findings": finding_list
  }

@app.delete("/scans/{scan_id}")
def delete_scan(scan_id: int): 
  db = SessionLocal()
  
  try: 
    scan_search = db.get(Scan, scan_id)
    if scan_search == None: 
      return {
        "error": True, 
        "message": "Scan not found"
      }
    
    finding_search = db.query(Finding).filter(Finding.scan_id == scan_id).all()

    for finding in finding_search: 
      db.delete(finding)
    
    db.delete(scan_search)
    db.commit()
    
  finally: 
    db.close()
  
  return {
    "message": "Scan successfully deleted",
    "scan_id": scan_id,
  }