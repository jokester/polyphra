from ._singleton import app
from .minimax_tts import get_minimax_api
from pydantic import BaseModel
from ._singleton import ActorId
from fastapi import Header
import base64


@app.get("/")
async def root():
    return {"message": "Welcome to the Polypora API!!"}


class CreateTTSRequest(BaseModel):
    actor: ActorId
    text: str


@app.post("/tts_1")
async def tts_1(req: CreateTTSRequest, authorization: str = Header(None)):
    from .minimax_tts import text2audio

    mp3_bytes, mp3_duration = await text2audio(actor=req.actor, text=req.text)
    return {
        "audio_uri": "data:audio/mpeg;base64,"
        + base64.b64encode(mp3_bytes).decode("utf-8"),
        "audio_duration": mp3_duration,
    }


class CreateParaphraseRequest(BaseModel):
    actor: ActorId
    text: str


@app.post("/paraphrase_1")
async def paraphrase_1(req: CreateTTSRequest, authorization: str = Header(None)):
    from .gemini_paraphrase import llm_paraphrase

    return {"text": await llm_paraphrase(actor=req.actor, orig_text=req.text)}
