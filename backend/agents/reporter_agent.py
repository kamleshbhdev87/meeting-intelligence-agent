import anthropic
import os

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

def generate_report(extracted_data: dict, meeting_title: str, meeting_date: str) -> dict:
    """
    Takes structured extracted data and generates:
    - An executive summary (5 bullet points max)
    - A professional follow-up email draft
    """

    decisions = extracted_data.get("decisions", [])
    action_items = extracted_data.get("action_items", [])
    risks = extracted_data.get("risks", [])

    decisions_text = "\n".join([f"- {d['decision']} (Owner: {d.get('owner','TBD')})" for d in decisions]) or "None"
    actions_text = "\n".join([f"- {a['task']} (Owner: {a.get('owner','TBD')}, Deadline: {a.get('deadline','TBD')})" for a in action_items]) or "None"
    risks_text = "\n".join([f"- {r['risk']} (Raised by: {r.get('raised_by','Unknown')})" for r in risks]) or "None"

    # Generate executive summary
    summary_prompt = f"""You are a senior executive assistant. Write a concise executive summary of this meeting in exactly 5 bullet points or fewer.
Be specific, clear, and action-oriented. No fluff.

Meeting: {meeting_title} ({meeting_date})

Decisions Made:
{decisions_text}

Action Items:
{actions_text}

Risks & Blockers:
{risks_text}

Write the executive summary as plain bullet points starting with "•". No headers, no preamble."""

    summary_message = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=500,
        messages=[{"role": "user", "content": summary_prompt}]
    )
    executive_summary = summary_message.content[0].text.strip()

    # Generate follow-up email
    email_prompt = f"""You are a professional business writer. Write a clean follow-up email for this meeting.

Meeting: {meeting_title} ({meeting_date})

Decisions Made:
{decisions_text}

Action Items:
{actions_text}

Risks & Blockers:
{risks_text}

Write ONLY the email body (no "Subject:" line). Start with a greeting, include all decisions, action items, and risks in a professional format, and close with next steps. Keep it concise and professional."""

    email_message = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=800,
        messages=[{"role": "user", "content": email_prompt}]
    )
    email_draft = email_message.content[0].text.strip()

    return {
        "executive_summary": executive_summary,
        "email_draft": email_draft
    }
