#!/usr/bin/env python3
"""Batch-generate sentence MP3s via edge-tts (Microsoft zh-CN neural voices, free)."""

from __future__ import annotations

import asyncio
import json
import sys
from pathlib import Path

try:
    import edge_tts
except ImportError:
    print("Install edge-tts: pip install -r requirements-audio.txt", file=sys.stderr)
    sys.exit(1)

ROOT = Path(__file__).resolve().parent.parent
PACK_PATH = ROOT / "starter-pack.json"
AUDIO_DIR = ROOT / "audio"

VOICE = "zh-CN-YunjianNeural"
RATE = "-15%"


def build_speech_text(sentence: dict) -> str:
    """Plain text for edge-tts (SSML/phoneme tags are escaped and read aloud)."""
    if tts_text := sentence.get("ttsText"):
        return tts_text
    return sentence["hanzi"]


async def synthesize(text: str, output: Path) -> None:
    communicate = edge_tts.Communicate(text, VOICE, rate=RATE)
    await communicate.save(str(output))


async def main() -> None:
    pack = json.loads(PACK_PATH.read_text(encoding="utf-8"))
    sentences = pack["sentences"]
    AUDIO_DIR.mkdir(exist_ok=True)

    for index, sentence in enumerate(sentences, start=1):
        sentence_id = sentence["id"]
        text = build_speech_text(sentence)
        output = AUDIO_DIR / f"{sentence_id}.mp3"
        preview = text.replace("\n", " ")[:72]
        print(f"[{index}/{len(sentences)}] {sentence_id}: {preview}")
        await synthesize(text, output)
        sentence["audioUrl"] = f"audio/{sentence_id}.mp3"

    PACK_PATH.write_text(
        json.dumps(pack, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"\nDone — {len(sentences)} files in audio/")


if __name__ == "__main__":
    asyncio.run(main())
