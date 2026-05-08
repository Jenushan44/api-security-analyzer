from database.connection import SessionLocal 
from database.models import Scan, Finding

def save_scan_result(target_url, status_code, risk, findings): 
  db = SessionLocal()
  try: 
    pass
  except: 
    db.rollback()
    raise
  finally: 
    db.close()