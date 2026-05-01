from fastapi import FastAPI 
import requests
from schemas import ScanRequest
from scanner.rules import security_header
from scanner.findings import add_finding
from scanner.sensitive_data import scan_sensitive_keys
from scanner.risk import calculate_risk

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
      return {"error": "Request timed out"}
    except requests.exceptions.ConnectionError: 
      return {"error": "Could not connect to the URL."}
  else: 
    return {"error": "Invalid URL. URL must start with http:// or https://" }

  for header in security_header:
    if header not in response.headers: 
      add_finding(findings, header)
  try: 
    response_data = response.json()
  except: 
    response_data = None

  scan_sensitive_keys(response_data, findings)
  risk = calculate_risk(findings)

  return {
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