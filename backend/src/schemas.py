from pydantic import BaseModel
from typing import Optional

class ScanRequest(BaseModel):
  url: str 
  user_id: str

class UpdateScanRequest(BaseModel):
  report_title: Optional[str] = None
  report_type: Optional[str] = None
  report_icon: Optional[str] = None
  notes: Optional[str] = None