from pydantic import BaseModel
from typing import List, Optional

class AnalyzeRequest(BaseModel):
    transcript: str
    meeting_title: str = "Untitled Meeting"
    meeting_date: str = ""

class Decision(BaseModel):
    decision: str
    owner: Optional[str] = None

class ActionItem(BaseModel):
    task: str
    owner: Optional[str] = None
    deadline: Optional[str] = None

class Risk(BaseModel):
    risk: str
    raised_by: Optional[str] = None

class AnalyzeResponse(BaseModel):
    meeting_id: str
    meeting_title: str
    decisions: List[Decision]
    action_items: List[ActionItem]
    risks: List[Risk]
    executive_summary: str
    email_draft: str

class SearchRequest(BaseModel):
    query: str

class SearchResult(BaseModel):
    meeting_id: str
    meeting_title: str
    date: str
    relevant_excerpt: str
    distance: Optional[float] = None

class SearchResponse(BaseModel):
    results: List[SearchResult]
