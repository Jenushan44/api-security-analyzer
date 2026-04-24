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
  response = requests.get(data.url)

  return {
    "target_url": data.url,
    "status_code": response.status_code,
    "headers": dict(response.headers), 
    "data": response.json()
  }