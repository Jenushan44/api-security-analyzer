import requests
from scanner.findings import add_finding

def check_rate_limiting(target_url, findings): 
  
  rate_limit_test_requests = 3 
  has_rate_limiting = False 
  rate_limit_headers = ["X-RateLimit-Limit", "X-RateLimit-Remaining", "Retry-After", "X-RateLimit-Reset",  "RateLimit-Limit", "RateLimit-Remaining", "RateLimit-Reset"]

  for i in range(rate_limit_test_requests): 
    try: 
      response = requests.get(target_url, timeout=5)
    except requests.exceptions.Timeout: 
      return
    except requests.exceptions.ConnectionError: 
      return 
    except requests.exceptions.RequestException: 
      return 
    
    if response.status_code == 429:
      has_rate_limiting = True 
  
    for header in rate_limit_headers: 
      if header in response.headers: 
        has_rate_limiting = True 
    
  if has_rate_limiting == False: 
    add_finding(findings, "missing_rate_limiting")