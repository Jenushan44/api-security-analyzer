from database.connection import SessionLocal 
from database.models import Scan, Finding

def save_scan_result(target_url, status_code, risk, findings): 
  db = SessionLocal()
  try: 
    new_scan = Scan(
      target_url = target_url, 
      status_code = status_code, 
      risk_score = risk["risk_score"], 
      risk_level = risk["risk_level"], 
      risk_summary = risk["risk_summary"],
    )
    db.add(new_scan)
    db.commit()
    db.refresh(new_scan)

    for finding in findings: 
      new_finding = Finding(
        scan_id = new_scan.id, 
        title = finding["title"], 
        severity = finding["severity"], 
        category = finding["category"], 
        evidence = finding["evidence"], 
        recommendation = finding["recommendation"],
        )
      db.add(new_finding)
    db.commit()

    return new_scan.id
  except: 
    # undo partial database changes
    db.rollback()
    raise
  finally: 
    db.close()