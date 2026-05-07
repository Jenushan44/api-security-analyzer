from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import DeclarativeBase
from datetime import datetime 

# Classes that inherit from Base are database models that can map to tables
class Base(DeclarativeBase): 
  pass

# Scan represents one row in the scans database table. 
# Each row stores the summary of one API scan. 
class Scan(Base): 
  __tablename__ = "scans"
  id = Column(Integer, primary_key = True)
  target_url = Column(Text)  
  status_code = Column(Integer)
  risk_score = Column(Integer)
  risk_level = Column(String)
  risk_summary = Column(Text)
  created_at = Column(DateTime, default = datetime.now)


# Finding represents one row in the findings database table. 
# Each row stores one security issue that belongs to a saved API scan. 
class Finding(Base):
  __tablename__ = "findings"
  id = Column(Integer, primary_key=True)
  scan_id = Column(Integer, ForeignKey("scans.id"))
  title = Column(Text)
  severity = Column(String)
  category = Column(String)
  evidence = Column(Text)
  recommendation = Column(Text)


