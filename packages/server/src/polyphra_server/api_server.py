from ._singleton import app
from .service import default_services, Session
from .minimax_tts import get_minimax_api
from pydantic import BaseModel
from fastapi import Header
from ._actor import ActorId, ActorSpec, actor_presets
import base64



@app.get("/")
async def root():
    return {"message": "Welcome to the Polypora API!!"}


@app.get("/actors")
async def get_actors() -> list[ActorSpec]:
    return  actor_presets


@app.get('/session/current')
async def get_current_session(authorization: str = Header(None)) -> Session | None:
    if authorization:
        return default_services.session.inflate_session(authorization)

@app.post('/session/create_guest_session')
async def create_guest_session() -> str:
    new_session = default_services.session.create_session()
    return new_session


class CreateTTSRequest(BaseModel):
    actor: ActorId
    text: str


@app.post("/v1/tts/create")
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


@app.post("/v1/paraphrase/create")
async def paraphrase_1(req: CreateTTSRequest, authorization: str = Header(None)):
    from .gemini_paraphrase import llm_paraphrase

    return {"text": await llm_paraphrase(actor=req.actor, orig_text=req.text)}
