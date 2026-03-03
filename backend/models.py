from sqlalchemy import Column, Integer, String, Float, DateTime
from database import Base
import datetime

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    building_name = Column(String, index=True)
    facility_type = Column(String, index=True)
    compliance_score = Column(Float)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
