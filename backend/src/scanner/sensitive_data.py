from backend.src.scanner.rules import sensitive_keys 
from backend.src.scanner.findings import add_finding

def scan_sensitive_keys(response_data, findings): 
  if isinstance(response_data, dict):
    for key in response_data.keys(): 
      if key in sensitive_keys:
        add_finding(findings, key)
        
      if isinstance(response_data[key], dict): 
        scan_sensitive_keys(response_data[key], findings)
      elif isinstance(response_data[key], list): 
        scan_sensitive_keys(response_data[key], findings)
  elif isinstance(response_data, list):
    for item in response_data: 
      if isinstance(item, dict): 
        scan_sensitive_keys(item, findings)