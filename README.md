---
title: MeetingMind - AI Meeting Intelligence Agent
emoji: 🧠
colorFrom: blue
colorTo: purple
sdk: docker
pinned: false
license: mit
app_port: 7860
---

# 🧠 MeetingMind — AI Meeting Intelligence Agent

Transform meeting transcripts into structured intelligence using a 3-agent AI pipeline powered by Claude API.

## Features
- 🔍 **Extractor Agent** — Identifies decisions, action items, owners and deadlines
- 📝 **Reporter Agent** — Generates executive summary and follow-up email draft
- 🧠 **RAG Memory** — Stores meetings in ChromaDB for semantic search

## Tech Stack
- **Backend:** FastAPI + Python
- **Frontend:** React + Tailwind CSS
- **LLM:** Anthropic Claude API
- **Vector Store:** ChromaDB
- **Deployment:** Docker on Hugging Face Spaces

## Setup
Add your `ANTHROPIC_API_KEY` in the Space secrets settings.
