import anthropic
import json
import os
import re

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

def extract_from_transcript(transcript: str) -> dict:
    """
    Calls Claude API to extract structured data from a meeting transcript.
    Returns decisions, action items, risks, and key topics as JSON.
    """

    prompt = f"""You are an expert meeting analyst. Analyze the following meeting transcript and extract structured information.

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation, no code fences):
{{
  "decisions": [
    {{"decision": "string describing the decision", "owner": "name or null"}}
  ],
  "action_items": [
    {{"task": "string describing the task", "owner": "name or null", "deadline": "deadline string or null"}}
  ],
  "risks": [
    {{"risk": "string describing the risk or blocker", "raised_by": "name or null"}}
  ],
  "key_topics": ["topic1", "topic2"]
}}

Rules:
- Extract ALL decisions, even minor ones
- Extract ALL action items with owners and deadlines where mentioned
- Extract ALL risks, blockers, concerns raised
- If owner or deadline is not mentioned, use null
- If nothing found in a category, return empty array []
- Return valid JSON only, no markdown fences, no explanation

MEETING TRANSCRIPT:
{transcript}"""

    try:
        message = client.messages.create(
            model="claude-sonnet-4-5",
            max_tokens=1500,
            messages=[{{"role": "user", "content": prompt}}]
        )

        raw = message.content[0].text.strip()

        # Strip markdown code fences if present
        raw = re.sub(r"^```(?:json)?\n?", "", raw)
        raw = re.sub(r"\n?```$", "", raw)
        raw = raw.strip()

        if not raw:
            return {{"decisions": [], "action_items": [], "risks": [], "key_topics": []}}

        return json.loads(raw)

    except json.JSONDecodeError as e:
        print(f"JSON parse error: {{e}}, raw response: {{raw[:200]}}")
        return {{"decisions": [], "action_items": [], "risks": [], "key_topics": []}}
    except Exception as e:
        print(f"Extractor error: {{e}}")
        return {{"decisions": [], "action_items": [], "risks": [], "key_topics": []}}
