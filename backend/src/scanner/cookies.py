from backend.src.scanner.findings import add_finding

def check_cookie_security(headers, findings): 
  cookie_header = headers.get("Set-Cookie", None)

  if not cookie_header: 
    return

  cookie_header_lower = cookie_header.lower()

  if cookie_header: 
    if "httponly" not in cookie_header_lower: 
      add_finding(findings, "cookie_missing_httponly")
    if "secure" not in cookie_header_lower: 
      add_finding(findings, "cookie_missing_secure")
    if "samesite" not in cookie_header_lower:
      add_finding(findings, "cookie_missing_samesite")