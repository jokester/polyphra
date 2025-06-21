import functools
import os
import tempfile
import logging
from minimax_mcp.api import MinimaxApi

from ._singleton import ActorId

logger = logging.getLogger(__name__)

@functools.lru_cache(maxsize=1)
def get_minimax_api() -> MinimaxApi:
    """Get the Minimax API instance."""
    return MinimaxApi(
        api_host=os.environ.get('MINIMAX_API_HOST', 'https://api.minimax.io'),
        api_key=os.environ['MINIMAX_API_KEY'],
        resource_mode="local"
    )

def text2audio(actorId: ActorId, text: str) -> bytes:
    api_res = get_minimax_api().text_to_audio(
        text=text,
        output_directory=f"{tempfile.gettempdir()}/minimax_tts",
        voice_id=actorId.minimax_voice_id,
    )
    file_path = api_res['data']['file_path']
    logger.info("Audio file saved to %s", file_path)
    with open(file_path, 'rb') as f:
        return f.read()
