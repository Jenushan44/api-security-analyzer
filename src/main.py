from fastapi import FastAPI 
import requests
from pydantic import BaseModel

app = FastAPI() 

@app.get("/") 
def root():
  return {"message": "Test"}


class ScanRequest(BaseModel):
  url: str 

@app.post("/scan") 
def scan(data: ScanRequest):
  
  if data.url.startswith("https://") or data.url.startswith("http://"):
    response = requests.get(data.url)
  else: 
    return {"Error": "Invalid URL. URL must start with http:// or https://" }

  return {
    "target_url": data.url,
    "status_code": response.status_code,
    "headers": dict(response.headers), 
    "data": response.json()
  }