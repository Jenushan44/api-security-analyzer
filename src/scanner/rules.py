security_header = ["Content-Security-Policy", "X-Frame-Options", "X-Content-Type-Options", "Strict-Transport-Security", "Referrer-Policy"]
sensitive_keys = ["password", "token", "secret", "api_key", "access_token", "refresh_token", "private_key"]
findings = []
  
severity_points = {
  "Critical": 30, 
  "High": 20, 
  "Medium": 10, 
  "Low": 5,
}
  
rules = {

  "Content-Security-Policy" : {
    "title": "Missing Content-Security-Policy header",
    "severity": "High",
    "category": "Security Headers",
    "evidence": "Content-Security-Policy header was not found in the response",
    "recommendation": "Add a Content-Security-Policy header to restrict which resources can be loaded which reduce the risk of XSS attacks.",
  },

  "X-Frame-Options" : {
    "title": "Missing X-Frame-Options header",
    "severity": "Medium",
    "category": "Security Headers",
    "evidence": "X-Frame-Options header was not found in the response",
    "recommendation": "Add a X-Frame-Options header to prevent the site from being embedded in iframes and reduce clickjacking risk.",
  },

  "X-Content-Type-Options": {
    "title": "Missing X-Content-Type-Options header", 
    "severity": "Medium",
    "category": "Security Headers",
    "evidence": "X-Content-Type-Options header was not found in the response",
    "recommendation": "Add a X-Content-Type-Options header with value 'nosniff' to prevent the browser from interpreting files as a different MIME type.",

  },

  "Strict-Transport-Security": {
    "title": "Missing Strict-Transport-Security header",
    "severity": "High",
    "category": "Security Headers",
    "evidence": "Strict-Transport-Security header was not found in the response",
    "recommendation": "Add a Strict-Transport-Security header to enforce HTTPS connections and prevent man-in-the-middle attacks.",
  },

  "Referrer-Policy" : {
    "title": "Missing Referrer-Policy header",
    "severity": "Low",
    "category": "Security Headers",
    "evidence": "Referrer-Policy header was not found in the response",
    "recommendation": "Add a Referrer-Policy header to control how much referrer information is shared with external sites and reduce data leakage.",
  },

  "password" : {
    "title": "Password exposed in API response",
    "severity": "Critical",
    "category": "Sensitive Data Exposure",
    "evidence": "The response contains a field named password which may expose the user's credentials",
    "recommendation": "Remove password fields from API responses. Passwords should never be sent back to the client, even in test responses.",
  },

  "token": {
    "title": "Token exposed in API response",
    "severity": "High",
    "category": "Sensitive Data Exposure",
    "evidence": "The response contains a field named token which may expose an authentication or session token",
    "recommendation": "Avoid returning tokens in normal API responses unless the endpoint is meant for authentication.",
  },

  "secret": {
    "title": "Secret value exposed in API response",
    "severity": "Critical",
    "category": "Sensitive Data Exposure",
    "evidence": "The response contains a field named secret which may expose confidential application data",
    "recommendation": "Remove secret values from the response and keep them stored safely on the server side.",
  },

  "api_key": {
    "title": "API key exposed in API response", 
    "severity": "Critical",
    "category": "Sensitive Data Exposure",
    "evidence": "The response contains a field named api_key which may allow unauthorized access to external or internal services",
    "recommendation": "Do not expose API keys in API responses. Keep API keys on the backend so users cannot access/misuse them.",
  },

  "access_token": {
    "title": "Access token exposed in API response",
    "severity": "High",
    "category": "Sensitive Data Exposure",
    "evidence": "The response contains a field named access_token which may allow access to protected resources",
    "recommendation": "Only return access tokens when they are actually needed, such as during login and make sure they are handled securely.",
  },

  "refresh_token": {
    "title": "Refresh token exposed in API response",
    "severity": "Critical",
    "category": "Sensitive Data Exposure",
    "evidence": "The response contains a field named refresh_token which may allow long-term account access if stolen",
    "recommendation": "Avoid sending refresh tokens in regular API responses because they can give longer-term access if stolen.",
  },
    
  "private_key" : {
    "title": "Private key exposed in API response",
    "severity": "Critical",
    "category": "Sensitive Data Exposure",
    "evidence": "The response contains a field named private_key which may expose cryptographic credentials",
    "recommendation": "Never return private keys in an API response. Private keys should stay protected on the server and should not be visible to users.",
  },

  "missing_rate_limiting" : {
    "title": "Missing or weak rate limiting detected", 
    "severity": "Medium", 
    "category": "Rate Limiting", 
    "evidence": "No rate limiting response or rate limit headers were seen during a small repeated-request test", 
    "recommendation": "Add rate limiting to protect the API from abuse, brute-force attempts and excessive automated requests."
  },

  "potential_auth_exposure" : {
    "title": "Potential unauthenticated data exposure", 
    "severity": "Medium",
    "category": "Authentication Exposure", 
    "evidence": "The endpoint returned user or account-related fields in a publicly accessible response.",
    "recommendation": "Review if this endpoint should require authentication before returning user or account-related data.",
  },

  "permissive_cors_origin" : {
    "title": "CORS allows all origins", 
    "severity": "Medium", 
    "category": "CORS Misconfiguration", 
    "evidence": "The response included Acess-Control-Allow-Origin: *, which allows any website origin to read the API response from a browser.",
    "recommendation": "Limit Access-Control-Allow-Origin to the frontend domaisn that actually need access. "
  }, 

  "cors_credentials_with_wildcard": {
    "title": "CORS allows credentials with a wildcard origin",
    "severity": "High", 
    "category": "CORS Misconfiguration", 
    "evidence": "The response allows credentials while also using a wildcard CORS origin.", 
    "recommendation": "Do not allow credentials with a wildcard origin. Use specific trusted origins instead. "
  }, 

  "cookie_missing_httponly": {
    "title": "Cookie missing HttpOnly attribute", 
    "severity": "medium", 
    "category": "Cookie Security", 
    "evidence": "The response sets a cookie without the HttpOnly attribute.",
    "recommendation": "Add HttpOnly to cookies that do not need to be accessed by JavaScript."
  }, 

  "cookie_missing_secure": {
    "title": "Cookie missing Secure attribute", 
    "severity": "High", 
    "category": "Cookie Security", 
    "evidence": "The response sets a cookie without the Secure attribute", 
    "recommendation": "Add Secure so the cookie is only sent over HTTPS."
  }, 

  "cookie_missing_samesite": {
    "title": "Cookie missing SameSite attribute", 
    "severity": "Medium", 
    "category": "Cookie Security", 
    "evidence": "The response sets a cookie without a SameSite attribute.",
    "recommendation": "Add a SameSite value such as Lax or Strict uncless cross-site cookie behavior is required."
  }


}
