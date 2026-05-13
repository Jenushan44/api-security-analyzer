def build_error_response(error_type, target_url):
    error_handling = {
      "invalid_url": {
        "error": True, 
        "error_type": "invalid_url", 
        "message": "Invalid URL. URL must start with http:// or https://"
      },

      "timeout": {
        "error": True,
        "error_type": "timeout",
        "message": "The request timed out. The server took too long to respond." 
      }, 

      "connection_error": {
        "error": True, 
        "error_type": "connection_error", 
        "message": "Could not connect to the target URL. The domain may be unreachable or unavailable",
      }, 

      "request_error": {
        "error": True, 
        "error_type": "request_error", 
        "message": "The scan request failed due to a network or request error",
      }, 
    }
    selected_error = error_handling[error_type]
    selected_error["target_url"] = target_url

    return selected_error