import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .service import default_services, Session
from pydantic import BaseModel
from fastapi import Header
from .model import ActorId, ActorSpec, actor_presets
import base64

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for simplicity, adjust as needed
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

logger.info("FastAPI app created")


@app.get("/")
async def root():
    return {"message": "Welcome to the Polypora API!!"}


@app.get("/session/current")
async def get_current_session(authorization: str = Header(None)) -> Session | None:
    if authorization:
        return default_services.session.inflate_session(authorization)


@app.post("/session/create_guest_session")
async def create_guest_session() -> str:
    new_session = default_services.session.create_session()
    return new_session


@app.get("/actors")
async def get_actors() -> list[ActorSpec]:
    return actor_presets


class CreateParaphraseRequest(BaseModel):
    actor: ActorId
    text: str


@app.post("/paraphrase/create")
async def paraphrase_1(req:CreateParaphraseRequest, authorization: str = Header(None)):
    return {
        "text": await default_services.paraphrase_text(
            actor=req.actor, orig_text=req.text
        )
    }
class CreateTTSRequest(BaseModel):
    actor: ActorId
    text: str


@app.post("/tts/create")
async def tts_1(req: CreateTTSRequest, authorization: str = Header(None)):
    mp3_bytes, mp3_duration = await default_services.text2audio(
        actor=req.actor, text=req.text
    )
    return {
        "audio_uri": "data:audio/mpeg;base64,"
        + base64.b64encode(mp3_bytes).decode("utf-8"),
        "audio_duration": mp3_duration,
    }

