from fastapi import FastAPI 
import requests
from pydantic import BaseModel

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

class ScanRequest(BaseModel):
  url: str 

@app.post("/scan") 
def scan(data: ScanRequest):
  
  security_header = ["Content-Security-Policy", "X-Frame-Options", "X-Content-Type-Options", "Strict-Transport-Security", "Referrer-Policy"]
  sensitive_keys = ["password", "token", "secret", "api_key", "access_token", "refresh_token", "private_key"]
  findings = []
  
  severity_points = {
    "Critical": 30, 
    "High": 20, 
    "Medium": 10, 
    "Low": 5,
  }
  
  severity_counts = {
    "Critical": 0, 
    "High": 0, 
    "Medium": 0,
    "Low": 0,
  }

  category_counts = {
    "Security Headers": 0,
    "Sensitive Data Exposure": 0,
  }

  risk_score = 0
  risk_level = ""
  risk_summary = ""

  title = {
    "Content-Security-Policy": "Missing Content-Security-Policy header",
    "X-Frame-Options": "Missing X-Frame-Options header",
    "X-Content-Type-Options": "Missing X-Content-Type-Options header", 
    "Strict-Transport-Security": "Missing Strict-Transport-Security header", 
    "Referrer-Policy": "Missing Referrer-Policy header",
    "password": "Password exposed in API response",
    "token": "Token exposed in API response",
    "secret": "Secret value exposed in API response", 
    "api_key": "API key exposed in API response", 
    "access_token": "Access token exposed in API response",
    "refresh_token": "Refresh token exposed in API response",
    "private_key": "Private key exposed in API response",
  }

  severity = {
    "Content-Security-Policy": "High",
    "X-Frame-Options": "Medium",
    "X-Content-Type-Options": "Medium", 
    "Strict-Transport-Security": "High", 
    "Referrer-Policy": "Low",
    "password": "Critical",
    "token": "High",
    "secret": "Critical", 
    "api_key": "Critical", 
    "access_token": "High",
    "refresh_token": "Critical",
    "private_key": "Critical",  
    }

  category = {
    "Content-Security-Policy": "Security Headers",
    "X-Frame-Options": "Security Headers",
    "X-Content-Type-Options": "Security Headers", 
    "Strict-Transport-Security": "Security Headers", 
    "Referrer-Policy": "Security Headers",
    "password": "Sensitive Data Exposure",
    "token": "Sensitive Data Exposure",
    "secret": "Sensitive Data Exposure", 
    "api_key": "Sensitive Data Exposure", 
    "access_token": "Sensitive Data Exposure",
    "refresh_token": "Sensitive Data Exposure",
    "private_key": "Sensitive Data Exposure",  
  }

  evidence = {
    "Content-Security-Policy": "Content-Security-Policy header was not found in the response",
    "X-Frame-Options": "X-Frame-Options header was not found in the response",
    "X-Content-Type-Options": "X-Content-Type-Options header was not found in the response", 
    "Strict-Transport-Security": "Strict-Transport-Security header was not found in the response", 
    "Referrer-Policy": "Referrer-Policy header was not found in the response",
    "password": "The response contains a field named password which may expose the user's credentials",
    "token": "The response contains a field named token which may expose an authentication or session token",
    "secret": "The response contains a field named secret which may expose confidential application data", 
    "api_key": "The response contains a field named api_key which may allow unauthorized access to external or internal services", 
    "access_token": "The response contains a field named access_token which may allow access to protected resources",
    "refresh_token": "The response contains a field named refresh_token which may allow long-term account access if stolen",
    "private_key": "The response contains a field named private_key which may expose cryptographic credentials",  
  }


  recommendation = {
    "Content-Security-Policy": "Add a Content-Security-Policy header to restrict which resources can be loaded which reduce the risk of XSS attacks.",
    "X-Frame-Options": "Add a X-Frame-Options header to prevent the site from being embedded in iframes and reduce clickjacking risk.",
    "X-Content-Type-Options": "Add a X-Content-Type-Options header with value 'nosniff' to prevent the browser from interpreting files as a different MIME type.", 
    "Strict-Transport-Security": "Add a Strict-Transport-Security header to enforce HTTPS connections and prevent man-in-the-middle attacks.", 
    "Referrer-Policy": "Add a Referrer-Policy header to control how much referrer information is shared with external sites and reduce data leakage.",
    "password": "Remove password fields from API responses. Passwords should never be sent back to the client, even in test responses.",
    "token": "Avoid returning tokens in normal API responses unless the endpoint is meant for authentication.",
    "secret": "Remove secret values from the response and keep them stored safely on the server side.", 
    "api_key": "Do not expose API keys in API responses. Keep API keys on the backend so users cannot access/misuse them.", 
    "access_token": "Only return access tokens when they are actually needed, such as during login and make sure they are handled securely.",
    "refresh_token": "Avoid sending refresh tokens in regular API responses because they can give longer-term access if stolen.",
    "private_key": "Never return private keys in an API response. Private keys should stay protected on the server and should not be visible to users.",  
  }


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
      findings.append({
        "title": title[header],
        "severity": severity[header], 
        "category": category[header], 
        "evidence": evidence[header], 
        "recommendation": recommendation[header]
      })
  
  try: 
    response_data = response.json()
  except: 
    response_data = None

  def scan_sensitive_keys(response_data): 
    if isinstance(response_data, dict):
      for key in response_data.keys(): 
        if key in sensitive_keys:
          findings.append({
            "title": title[key],
            "severity": severity[key], 
            "category": category[key], 
            "evidence": evidence[key], 
            "recommendation": recommendation[key]
          })
          
        if isinstance(response_data[key], dict): 
          scan_sensitive_keys(response_data[key])
        elif isinstance(response_data[key], list): 
          scan_sensitive_keys(response_data[key])

    elif isinstance(response_data, list):
      for item in response_data: 
        if isinstance(item, dict): 
          scan_sensitive_keys(item)
        
  scan_sensitive_keys(response_data)

  for finding in findings:
    severity_counts[finding["severity"]] += 1
    category_counts[finding["category"]] += 1
    risk_score += severity_points[finding["severity"]]
    
  risk_score = min(100, risk_score)
  
  if risk_score == 0: 
    risk_level = "None"
  elif risk_score <= 25: 
    risk_level = "Low"
  elif risk_score <= 50: 
    risk_level = "Medium"
  elif risk_score <= 75: 
    risk_level = "High"
  else: 
    risk_level = "Critical"

  if risk_level == "Critical": 
    risk_summary = "Critical risk detected due to serious security findings that should be fixed as soon as possible."
  elif risk_level == "High":
    risk_summary = "High risk detected, the API has multiple security issues that should be fixed soon."
  elif risk_level == "Medium": 
    risk_summary = "Medium risk detected, the API has some security issues that are worth reviewing and improving."
  elif risk_level == "Low": 
    risk_summary = "Low risk detected, the API has a few minor security concerns but nothing severe was detected."
  else: 
    risk_summary = "No security issues were found."

  return {
    "target_url": data.url,
    "status_code": response.status_code,
    "headers": dict(response.headers), 
    "data": response_data,
    "findings": findings,
    "risk_score": risk_score, 
    "risk_level": risk_level, 
    "risk_summary": risk_summary, 
    "severity_counts": severity_counts, 
    "category_counts": category_counts,
  }