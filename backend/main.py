from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import uuid
import os
from datetime import datetime

load_dotenv()

from models.schemas import (
    AnalyzeRequest, AnalyzeResponse,
    SearchRequest, SearchResponse,
    Decision, ActionItem, Risk
)
from agents.extractor_agent import extract_from_transcript
from agents.reporter_agent import generate_report
from agents.rag_agent import store_meeting, search_meetings, get_all_meetings

app = FastAPI(
    title="Meeting Intelligence Agent",
    description="AI-powered meeting transcript analyzer using Claude API + RAG",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok", "model": "claude-sonnet-4-20250514"}

@app.post("/analyze", response_model=AnalyzeResponse)
def analyze_transcript(request: AnalyzeRequest):
    """
    Analyzes a meeting transcript using 3 agents:
    1. Extractor Agent - extracts decisions, action items, risks
    2. Reporter Agent - generates executive summary + email draft
    3. RAG Agent - stores meeting for future search
    """
    if not request.transcript.strip():
        raise HTTPException(status_code=400, detail="Transcript cannot be empty")

    if not os.getenv("ANTHROPIC_API_KEY"):
        raise HTTPException(status_code=500, detail="ANTHROPIC_API_KEY not configured")

    try:
        # Agent 1: Extract structured data
        extracted = extract_from_transcript(request.transcript)

        # Agent 2: Generate summary + email
        meeting_date = request.meeting_date or datetime.now().strftime("%Y-%m-%d")
        report = generate_report(extracted, request.meeting_title, meeting_date)

        # Agent 3: Store in RAG
        meeting_id = str(uuid.uuid4())[:8]
        store_meeting(
            meeting_id=meeting_id,
            meeting_title=request.meeting_title,
            meeting_date=meeting_date,
            extracted_data=extracted,
            executive_summary=report["executive_summary"]
        )

        return AnalyzeResponse(
            meeting_id=meeting_id,
            meeting_title=request.meeting_title,
            decisions=[Decision(**d) for d in extracted.get("decisions", [])],
            action_items=[ActionItem(**a) for a in extracted.get("action_items", [])],
            risks=[Risk(**r) for r in extracted.get("risks", [])],
            executive_summary=report["executive_summary"],
            email_draft=report["email_draft"]
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/search", response_model=SearchResponse)
def search_past_meetings(request: SearchRequest):
    """
    Searches past meetings using semantic similarity (RAG).
    """
    if not request.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    try:
        results = search_meetings(request.query)
        return SearchResponse(results=results)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/meetings")
def list_meetings():
    """Returns all stored meetings."""
    try:
        return {"meetings": get_all_meetings()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
