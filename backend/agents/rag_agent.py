import chromadb
import os
import json
from datetime import datetime

# Persistent ChromaDB client
chroma_client = chromadb.PersistentClient(path="./chroma_db")
collection = chroma_client.get_or_create_collection(
    name="meetings",
    metadata={"hf:space": "cosine"}
)

def store_meeting(meeting_id: str, meeting_title: str, meeting_date: str, extracted_data: dict, executive_summary: str):
    """
    Stores a meeting summary in ChromaDB for future semantic retrieval.
    Uses the executive summary + key decisions as the searchable document.
    """

    decisions = extracted_data.get("decisions", [])
    action_items = extracted_data.get("action_items", [])
    risks = extracted_data.get("risks", [])

    # Build a rich text document for embedding
    doc_text = f"""Meeting: {meeting_title}
Date: {meeting_date}
Summary: {executive_summary}

Decisions: {' | '.join([d['decision'] for d in decisions])}
Action Items: {' | '.join([a['task'] for a in action_items])}
Risks: {' | '.join([r['risk'] for r in risks])}"""

    metadata = {
        "meeting_title": meeting_title,
        "date": meeting_date or datetime.now().strftime("%Y-%m-%d"),
        "decisions_count": len(decisions),
        "actions_count": len(action_items),
        "risks_count": len(risks),
        "summary": executive_summary[:500]  # ChromaDB metadata limit
    }

    collection.upsert(
        ids=[meeting_id],
        documents=[doc_text],
        metadatas=[metadata]
    )

def search_meetings(query: str, n_results: int = 3) -> list:
    """
    Searches past meetings using semantic similarity.
    Returns top N matching meetings with relevant excerpts.
    """

    total = collection.count()
    if total == 0:
        return []

    results = collection.query(
        query_texts=[query],
        n_results=min(n_results, total)
    )

    meetings = []
    if results and results["ids"] and results["ids"][0]:
        for i, meeting_id in enumerate(results["ids"][0]):
            metadata = results["metadatas"][0][i]
            document = results["documents"][0][i]
            distance = results["distances"][0][i] if results.get("distances") else None

            meetings.append({
                "meeting_id": meeting_id,
                "meeting_title": metadata.get("meeting_title", "Unknown"),
                "date": metadata.get("date", ""),
                "relevant_excerpt": metadata.get("summary", document[:300]),
                "distance": round(distance, 4) if distance is not None else None
            })

    return meetings

def get_all_meetings() -> list:
    """Returns all stored meetings for listing."""
    total = collection.count()
    if total == 0:
        return []

    results = collection.get()
    meetings = []
    for i, meeting_id in enumerate(results["ids"]):
        metadata = results["metadatas"][i]
        meetings.append({
            "meeting_id": meeting_id,
            "meeting_title": metadata.get("meeting_title", "Unknown"),
            "date": metadata.get("date", ""),
            "decisions_count": metadata.get("decisions_count", 0),
            "actions_count": metadata.get("actions_count", 0),
            "risks_count": metadata.get("risks_count", 0),
        })
    return meetings
