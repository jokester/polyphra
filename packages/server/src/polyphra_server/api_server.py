from ._singleton import app
from .minimax_tts import get_minimax_api
from pydantic import BaseModel
from ._singleton import ActorId



@app.get("/")
async def root():
    return {"message": "Welcome to the Polypora API!!"}

class CreateTTSRequest(BaseModel):
    text: str
    actor: str

@app.post("/tts")
async def x(req: CreateTTSRequest):
    minimax = get_minimax_api()
    actor = ActorId(req.actor)

    tts_dict = minimax.text_to_audio(model="")
