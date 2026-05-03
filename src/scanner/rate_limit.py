import requests

def check_rate_limiting(target_URL, findings): 
  
  rate_limit_test_requests = 3 
  has_rate_limiting = False 

  for num in rate_limit_test_requests: 
    response = requests.get(target_URL, timeout=5)
    if response.status_code == 429:
      has_rate_limiting = True 
