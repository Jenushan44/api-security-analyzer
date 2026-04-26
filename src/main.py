from fastapi import FastAPI 
import requests
from pydantic import BaseModel

app = FastAPI() 

@app.get("/") 
def root():
  return {"message": "Test"}


class ScanRequest(BaseModel):
  url: str 

@app.post("/scan") 
def scan(data: ScanRequest):
  
  security_header = ["Content-Security-Policy", "X-Frame-Options", "X-Content-Type-Options", "Strict-Transport-Security", "Referrer-Policy"]
  findings = []

  if data.url.startswith("https://") or data.url.startswith("http://"):
    try: 
      response = requests.get(data.url, timeout = 5)
    except requests.exceptions.Timeout: 
      return {"error": "Request timed out"}
  else: 
    return {"error": "Invalid URL. URL must start with http:// or https://" }

  for header in security_header:
    if header not in response.headers: 
      findings.append("Missing " + header)
  
  return {
    "target_url": data.url,
    "status_code": response.status_code,
    "headers": dict(response.headers), 
    "data": response.json(),
    "findings": findings
  }

