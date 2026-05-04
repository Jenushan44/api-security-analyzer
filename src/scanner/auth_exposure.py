from scanner.findings import add_finding

def contains_auth_exposure(response_data): 
  
  auth_exposure_keys = ["username", "email", "role", "user_id", "account_id"]
  
  if isinstance(response_data, dict): 
    for key in response_data.keys(): 
      if key in auth_exposure_keys: 
        return True 
      if isinstance(response_data[key], dict): 
        result = contains_auth_exposure(response_data[key])
        if result == True: 
          return True
      elif isinstance(response_data[key], list): 
        result = contains_auth_exposure(response_data[key])
        if result == True: 
          return True
  elif isinstance(response_data, list): 
    for item in response_data: 
      if isinstance(item, dict): 
        result = contains_auth_exposure(item)
        if result == True: 
          return True
  return False 

def check_auth_exposure(response_data, status_code, findings): 
  if status_code != 200: 
    return 
  
  if contains_auth_exposure(response_data) == True: 
    add_finding(findings, "potential_auth_exposure")