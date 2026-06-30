from fastapi import FastAPI 
import requests
from schemas import ScanRequest, UpdateScanRequest
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
import time

app = FastAPI() 

app.add_middleware(
  CORSMiddleware, 
  allow_origins = [  
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "https://api-security-analyzer.vercel.app",
    ], 
  allow_credentials = True,   
  allow_methods = ["*"], 
  allow_headers = ["*"],
)

@app.get("/") 
def root():
  return {"message": "API Security Analyzer backend is running"}

# Runs all scanner checks aginst provided URL and saves scan under current Firebase user.
@app.post("/scan") 
def scan(data: ScanRequest):
  findings = []
  start_time = time.perf_counter()


  # Only scan http/https urls to avoid invalid request URLs. 
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
  
  #Convert the findings into overall risk score
  risk = calculate_risk(findings)
  scan_id = save_scan_result(data.url, response.status_code, risk, findings, data.user_id)  
  db = SessionLocal()

  try: 
    saved_scan = db.get(Scan, scan_id)
    created_at = saved_scan.created_at.isoformat() if saved_scan else None 
  finally: 
    db.close()
  
  end_time = time.perf_counter()
  time_passed = round((end_time - start_time ) * 1000, 2)

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
    "response_time_ms": time_passed, 
    "created_at": created_at,
    "total_findings": len(findings),
  }

@app.get("/scans") 
def get_scans(user_id: str): 
  scan_results = []
  db = SessionLocal()
  try: 
    # returns the current user's most recent scan summaries
    scans = db.query(Scan).filter(Scan.user_id == user_id).order_by(Scan.created_at.desc()).limit(20).all() 
    for scan in scans: 
      total_findings = db.query(Finding).filter(Finding.scan_id == scan.id).count()
      scan_dict = {"id": scan.id, "target_url": scan.target_url, "status_code": scan.status_code, "risk_score": scan.risk_score, "risk_level": scan.risk_level, "risk_summary": scan.risk_summary, "created_at": scan.created_at, "total_findings": total_findings, "user_id": scan.user_id, "report_title": scan.report_title, "report_type": scan.report_type, "report_icon": scan.report_icon, "notes": scan.notes,}
      scan_results.append(scan_dict)
  finally: 
    db.close()
  
  return scan_results

# Returns one scan with its full findings only if it belongs to the current user
@app.get("/scans/{scan_id}")
def get_scan_report(scan_id: int, user_id: str): 
  db = SessionLocal()
  finding_list = []
  try: 
    scan_search = db.get(Scan, scan_id)    
    
    if scan_search == None: 
      return {
        "error": True, 
        "message": "Scan not found"
      }
    
    if scan_search.user_id != user_id:
      return {
        "error": True,
        "message": "You do not have access to this scan"
      }
    
    finding_search = db.query(Finding).filter(Finding.scan_id == scan_id).all()

    scan_dict = { "id": scan_search.id, "target_url": scan_search.target_url, "status_code": scan_search.status_code, "risk_score": scan_search.risk_score, "risk_level": scan_search.risk_level, "risk_summary": scan_search.risk_summary, "created_at": scan_search.created_at, "report_title": scan_search.report_title, "report_type": scan_search.report_type, "report_icon": scan_search.report_icon, "notes": scan_search.notes,}
 
 
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
def delete_scan(scan_id: int, user_id: str): 
  db = SessionLocal()
  
  try: 
    scan_search = db.get(Scan, scan_id)
    if scan_search == None: 
      return {
        "error": True, 
        "message": "Scan not found"
      }
    
    if scan_search.user_id != user_id:
      return {
        "error": True,
        "message": "You do not have access to delete this scan"
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

# Updates user report without changing original scan findings
@app.patch("/scans/{scan_id}")
def update_scan(scan_id: int, user_id: str, data: UpdateScanRequest):
  db = SessionLocal()

  try:
    scan_search = db.get(Scan, scan_id)

    if scan_search == None:
      return {
        "error": True,
        "message": "Scan not found"
      }

    if scan_search.user_id != user_id:
      return {
        "error": True,
        "message": "You do not have access to edit this scan"
      }

    scan_search.report_title = data.report_title
    scan_search.report_type = data.report_type
    scan_search.report_icon = data.report_icon
    scan_search.notes = data.notes

    db.commit()

  finally:
    db.close()

  return {
    "message": "Scan updated successfully",
    "scan_id": scan_id
  }