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

  title = {
    "Content-Security-Policy": "Missing Content-Security-Policy header",
    "X-Frame-Options": "Missing X-Frame-Options header",
    "X-Content-Type-Options": "Missing X-Content-Type-Options header", 
    "Strict-Transport-Security": "Missing Strict-Transport-Security header", 
    "Referrer-Policy": "Missing Referrer-Policy header"
  }

  severity = {
    "Content-Security-Policy": "High",
    "X-Frame-Options": "Medium",
    "X-Content-Type-Options": "Medium", 
    "Strict-Transport-Security": "High", 
    "Referrer-Policy": "Low"
  }

  category = {
    "Content-Security-Policy": "Security Headers",
    "X-Frame-Options": "Security Headers",
    "X-Content-Type-Options": "Security Headers", 
    "Strict-Transport-Security": "Security Headers", 
    "Referrer-Policy": "Security Headers"
  }

  evidence = {
    "Content-Security-Policy": "Content-Security-Policy header was not found in the response",
    "X-Frame-Options": "X-Frame-Options header was not found in the response",
    "X-Content-Type-Options": "X-Content-Type-Options header was not found in the response", 
    "Strict-Transport-Security": "Strict-Transport-Security header was not found in the response", 
    "Referrer-Policy": "Referrer-Policy header was not found in the response"
  }


  recommendation = {
    "Content-Security-Policy": "Add a Content-Security-Policy header to restrict which resources can be loaded which reduce the risk of XSS attacks.",
    "X-Frame-Options": "Add a X-Frame-Options header to prevent the site from being embedded in iframes and reduce clickjacking risk.",
    "X-Content-Type-Options": "Add a X-Content-Type-Options header with value 'nosniff' to prevent the browser from interpreting files as a different MIME type.", 
    "Strict-Transport-Security": "Add a Strict-Transport-Security header to enforce HTTPS connections and prevent man-in-the-middle attacks.", 
    "Referrer-Policy": "Add a Referrer-Policy header to control how much referrer information is shared with external sites and reduce data leakage."
  }


  if data.url.startswith("https://") or data.url.startswith("http://"):
    try: 
      response = requests.get(data.url, timeout = 5)
    except requests.exceptions.Timeout: 
      return {"error": "Request timed out"}
  else: 
    return {"error": "Invalid URL. URL must start with http:// or https://" }

  for header in security_header:
    if header not in response.headers: 
      findings.append({
        "title": title[header],
        "severity": severity[header], 
        "category": category[header], 
        "evidence": evidence[header], 
        "recommendation": recommendation[header]
      })
  
  return {
    "target_url": data.url,
    "status_code": response.status_code,
    "headers": dict(response.headers), 
    "data": response.json(),
    "findings": findings
  }

