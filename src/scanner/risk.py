from scanner.rules import severity_points

def calculate_risk(findings): 
  severity_counts = {
    "Critical": 0, 
    "High": 0, 
    "Medium": 0,
    "Low": 0,
  }
  
  category_counts = {
    "Security Headers": 0,
    "Sensitive Data Exposure": 0,
    "Rate Limiting": 0,
    "Authentication Exposure": 0,
    "CORS Misconfiguration": 0,
  }

  risk_score = 0
  risk_level = ""
  risk_summary = ""

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
    "risk_score": risk_score, 
    "risk_level": risk_level, 
    "risk_summary": risk_summary,
    "severity_counts" : severity_counts,
    "category_counts": category_counts,
    }