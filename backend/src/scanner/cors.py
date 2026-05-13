from scanner.findings import add_finding

def check_cors(headers, findings): 
  
  origin = headers.get("Access-Control-Allow-Origin", None)
  credentials = headers.get("Access-Control-Allow-Credentials", None)

  if origin == "*": 
    add_finding(findings, "permissive_cors_origin")
  
  if credentials: 
    if origin == "*" and credentials.lower() == "true": 
      add_finding(findings, "cors_credentials_with_wildcard")
