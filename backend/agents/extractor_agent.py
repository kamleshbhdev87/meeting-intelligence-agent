import anthropic
import json
import os
import re

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

def extract_from_transcript(transcript: str) -> dict:
    prompt = f"""You are an expert meeting analyst. Analyze the following meeting transcript and extract structured information.

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation, no code fences):
{{
  "decisions": [{{"decision": "string", "owner": "name or null"}}],
  "action_items": [{{"task": "string", "owner": "name or null", "deadline": "string or null"}}],
  "risks": [{{"risk": "string", "raised_by": "name or null"}}],
  "key_topics": ["topic1"]
}}

Rules:
- Extract ALL decisions, action items, risks
- Use null if owner or deadline not mentioned
- Return empty array [] if nothing found
- Return valid JSON only

MEETING TRANSCRIPT:
{transcript}"""

    try:
        message = client.messages.create(
            model="claude-sonnet-4-5",
            max_tokens=1500,
            messages=[{"role": "user", "content": prompt}]
        )

        raw = message.content[0].text.strip()
        raw = re.sub(r"^```(?:json)?\n?", "", raw)
        raw = re.sub(r"\n?```$", "", raw)
        raw = raw.strip()

        if not raw:
            return {"decisions": [], "action_items": [], "risks": [], "key_topics": []}

        return json.loads(raw)

    except json.JSONDecodeError as e:
        print(f"JSON parse error: {e}")
        return {"decisions": [], "action_items": [], "risks": [], "key_topics": []}
    except Exception as e:
        print(f"Extractor error: {e}")
        return {"decisions": [], "action_items": [], "risks": [], "key_topics": []}
