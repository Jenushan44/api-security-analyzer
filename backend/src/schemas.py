from pydantic import BaseModel

class ScanRequest(BaseModel):
  url: str 
  user_id: str