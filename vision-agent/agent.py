import asyncio
import json
import os

from dotenv import load_dotenv
from getstream import Stream as GetStream

from vision_agents.core import Agent, AgentLauncher, Runner, User
from vision_agents.plugins import getstream
from vision_agents.plugins.openai import Realtime

load_dotenv()

# ── Raw Stream client (sync) ──────────────────────────────────────────────────
# Used to read call custom data and to call goLive before the agent joins.
# The getstream package is already a dependency of vision-agents[getstream].

_stream = GetStream(
    api_key=os.environ["STREAM_API_KEY"],
    api_secret=os.environ["STREAM_API_SECRET"],
)

# ── Language fallback map ─────────────────────────────────────────────────────

LANGUAGE_MAP: dict[str, str] = {
    "es": "Spanish",
    "fr": "French",
    "de": "German",
    "it": "Italian",
    "pt": "Portuguese",
    "ja": "Japanese",
    "zh": "Mandarin Chinese",
    "ko": "Korean",
    "ar": "Arabic",
    "hi": "Hindi",
    "spanish": "Spanish",
    "french": "French",
    "german": "German",
    "italian": "Italian",
    "portuguese": "Portuguese",
    "japanese": "Japanese",
    "mandarin": "Mandarin Chinese",
    "chinese": "Mandarin Chinese",
    "korean": "Korean",
    "arabic": "Arabic",
    "hindi": "Hindi",
}

DEFAULT_LANGUAGE = os.getenv("DEFAULT_TARGET_LANGUAGE", "Spanish")


def _language_from_call_id(call_id: str) -> str:
    parts = call_id.lower().split("-")
    for part in parts[1:3]:
        resolved = LANGUAGE_MAP.get(part)
        if resolved:
            return resolved
    return DEFAULT_LANGUAGE


def _language_from_code(code: str) -> str:
    return LANGUAGE_MAP.get(code.lower(), DEFAULT_LANGUAGE)


def _fallback_instructions(target_language: str) -> str:
    return (
        f"You are Luna, an enthusiastic and encouraging AI language teacher. "
        f"Your student is an English speaker learning {target_language}. "
        f"Always speak English. Only switch to {target_language} when teaching a "
        f"specific word or phrase — say it clearly, give its English meaning, then "
        f"use it in a short example sentence. "
        f"Keep every response to 2-4 sentences so the conversation stays natural "
        f"over voice. Be warm, patient, and celebratory of progress. Gently correct "
        f"mistakes. Adapt to the student's level based on what they say. "
        f"Never use markdown, bullet points, numbered lists, or special characters "
        f"— this is voice only."
    )


def _build_instructions_from_custom(custom: dict) -> str:
    """Build a rich system prompt from the call's custom data fields."""
    language_code = custom.get("languageCode", "")
    language_name = _language_from_code(language_code) if language_code else DEFAULT_LANGUAGE
    lesson_title = custom.get("lessonTitle", "")
    system_prompt = custom.get("systemPrompt", "")
    goals_raw = custom.get("teachingGoals", "[]")
    vocab_raw = custom.get("vocabulary", "")
    phrases_raw = custom.get("phrases", "")

    base = system_prompt or _fallback_instructions(language_name)

    lines = [base, ""]

    if lesson_title:
        lines.append(f'LESSON: "{lesson_title}" ({language_name})')
        lines.append("")

    try:
        goals = json.loads(goals_raw) if goals_raw else []
    except Exception:
        goals = []
    if goals:
        lines.append("TEACHING GOALS:")
        for g in goals:
            lines.append(f"  • {g}")
        lines.append("")

    # vocab is stored as "word:translation|word:translation"
    if vocab_raw:
        lines.append("VOCABULARY FOR THIS LESSON:")
        for pair in vocab_raw.split("|"):
            if ":" in pair:
                word, translation = pair.split(":", 1)
                lines.append(f"  • {word} — {translation}")
        lines.append("")

    # phrases is stored as "phrase:translation|phrase:translation"
    if phrases_raw:
        lines.append("KEY PHRASES:")
        for pair in phrases_raw.split("|"):
            if ":" in pair:
                phrase, translation = pair.split(":", 1)
                lines.append(f"  • {phrase} — {translation}")
        lines.append("")

    lines += [
        "VOICE RULES:",
        "  • Keep every response to 2-4 sentences — this is a voice call.",
        "  • Speak English; only switch to the target language to teach a word or phrase.",
        "  • Never use markdown, bullet points, or special characters.",
        "  • Be warm, patient, and celebrate progress.",
        "  • Gently correct pronunciation and grammar mistakes.",
    ]

    return "\n".join(lines)


async def create_agent(**kwargs) -> Agent:
    return Agent(
        edge=getstream.Edge(),
        # ID must match AGENT_USER_ID in src/lib/stream.ts so the React Native
        # app can detect when the agent participant joins the call.
        agent_user=User(name="Luna", id="luna-language-teacher"),
        instructions=_fallback_instructions(DEFAULT_LANGUAGE),
        llm=Realtime(
            model="gpt-realtime-2",
            voice="marin",
            send_video=False,
        ),
    )


async def join_call(agent: Agent, call_type: str, call_id: str, **kwargs) -> None:
    loop = asyncio.get_event_loop()

    # ── 1. Read lesson context from the call's custom data ────────────────────
    # The Expo app packs systemPrompt, openingMessage, vocabulary, etc. into
    # the call's custom data when the user joins.  We read it here using the
    # sync getstream SDK via run_in_executor so we don't block the event loop.
    custom: dict = {}
    try:
        response = await loop.run_in_executor(
            None,
            lambda: _stream.video.call(call_type, call_id).get(),
        )
        custom = response.data.call.custom or {}
    except Exception as e:
        print(f"[agent] Warning: could not read call custom data: {e}")

    if custom.get("systemPrompt") or custom.get("lessonTitle"):
        agent.llm.set_instructions(_build_instructions_from_custom(custom))
    else:
        target_language = _language_from_call_id(call_id)
        agent.llm.set_instructions(_fallback_instructions(target_language))

    # ── 2. goLive via getstream SDK (admin-level) ─────────────────────────────
    # audio_room calls are live by default, but this is belt-and-suspenders for
    # any call-type config that might have backstage enabled.
    try:
        await loop.run_in_executor(
            None,
            lambda: _stream.video.call(call_type, call_id).go_live(),
        )
    except Exception as e:
        print(f"[agent] goLive skipped (already live or not needed): {e}")

    # ── 3. Join the call and run the lesson ───────────────────────────────────
    call = await agent.create_call(call_type, call_id)
    async with agent.join(call):
        opening = custom.get("openingMessage", "")
        if opening:
            prompt = (
                f'The student has just joined. Your opening message for this lesson '
                f'is: "{opening}". Say it naturally, as if speaking aloud for the first time.'
            )
        else:
            language = _language_from_call_id(call_id)
            prompt = (
                f"A new student has just joined their {language} lesson. "
                f"Greet them warmly in English, introduce yourself as Luna, "
                f"and open the lesson with a friendly first question or phrase."
            )

        await agent.simple_response(prompt)
        await agent.finish()


if __name__ == "__main__":
    Runner(
        AgentLauncher(
            create_agent=create_agent,
            join_call=join_call,
            agent_idle_timeout=120.0,
            max_concurrent_sessions=10,
            max_sessions_per_call=1,  # prevent duplicate agents on the same call
        )
    ).cli()
