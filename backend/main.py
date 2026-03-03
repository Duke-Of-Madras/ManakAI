from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from pydantic import BaseModel
import uvicorn
import re

import database
import models
from sqlalchemy.orm import Session
from sqlalchemy import func

models.Base.metadata.create_all(bind=database.engine)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

from modules.chat_auditor import query_wiki
from modules.vision_auditor import analyze_image
from modules.doc_auditor import analyze_document
from modules.vector_store import ingest_text

app = FastAPI(title="ManakAI Backend API (v2)", version="2.0.0")

# Setup CORS for the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

@app.get("/")
def read_root():
    return {"status": "ok", "message": "ManakAI API v2 is running powered by Gemini 1.5 Flash"}

@app.post("/api/chat")
def chat_endpoint(request: ChatRequest):
    try:
        answer = query_wiki(request.message)
        return {"status": "success", "answer": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def extract_score(text: str) -> float:
    # Try to find a pattern like "Score: 85" or "85/100"
    match = re.search(r'Score.*?(\d+)(?:\s*/\s*100)?', text, re.IGNORECASE)
    if match: return float(match.group(1))
    match = re.search(r'(\d+)\s*/\s*100', text)
    if match: return float(match.group(1))
    return 75.0 # fallback default if parsing fails

@app.post("/api/vision-audit")
async def vision_audit(
    file: UploadFile = File(...),
    placeName: str = Form("Unknown Facility"),
    buildingName: str = Form("Unknown Building"),
    db: Session = Depends(get_db)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File provided is not an image.")
    try:
        image_bytes = await file.read()
        analysis = analyze_image(image_bytes, placeName)
        
        score = extract_score(analysis)
        log_entry = models.AuditLog(
            building_name=buildingName,
            facility_type=placeName,
            compliance_score=score
        )
        db.add(log_entry)
        db.commit()
        
        return {"status": "success", "filename": file.filename, "analysis": analysis, "score": score}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/dashboard-stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    try:
        overall_avg = db.query(func.avg(models.AuditLog.compliance_score)).scalar() or 0.0
        total_scans = db.query(func.count(models.AuditLog.id)).scalar() or 0
        
        building_stats = db.query(
            models.AuditLog.building_name,
            func.avg(models.AuditLog.compliance_score),
            func.count(models.AuditLog.id)
        ).group_by(models.AuditLog.building_name).all()
        
        heatmap_data = [{"building": b[0], "score": round(b[1]), "scans": b[2]} for b in building_stats]
        
        # Recent 10 audit logs for the live feed
        recent_logs = db.query(models.AuditLog).order_by(
            models.AuditLog.timestamp.desc()
        ).limit(10).all()
        
        audit_feed = [{
            "id": str(log.id),
            "timestamp": log.timestamp.strftime("%H:%M:%S") if log.timestamp else "",
            "message": f"{log.building_name} — {log.facility_type} scan completed — Score {round(log.compliance_score)}%",
            "type": "scan"
        } for log in recent_logs]
        
        return {
            "overall_score": round(overall_avg),
            "total_scans": total_scans,
            "heatmap": heatmap_data,
            "audit_feed": audit_feed
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/audit-logs")
def get_audit_logs(db: Session = Depends(get_db)):
    try:
        logs = db.query(models.AuditLog).order_by(
            models.AuditLog.timestamp.desc()
        ).all()
        return [{
            "id": str(log.id),
            "action": f"{log.facility_type} Scan Completed",
            "result": f"Compliance score: {round(log.compliance_score)}%",
            "module": "Vision-Audit",
            "user": "System",
            "score": round(log.compliance_score),
            "building": log.building_name,
            "facility": log.facility_type,
            "timestamp": log.timestamp.strftime("%Y-%m-%d %H:%M:%S") if log.timestamp else ""
        } for log in logs]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/doc-audit")
async def doc_audit(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    try:
        pdf_bytes = await file.read()
        analysis = analyze_document(pdf_bytes)
        return {"status": "success", "filename": file.filename, "analysis": analysis}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class IngestRequest(BaseModel):
    doc_id: str
    text: str
    metadata: Optional[dict] = None

@app.post("/api/ingest-standards")
def ingest_endpoint(request: IngestRequest):
    try:
        result = ingest_text(request.doc_id, request.text, request.metadata)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
