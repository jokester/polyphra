import functools
import os
import tempfile
import logging
from minimax_mcp.api import MinimaxApi
from mutagen.mp3 import MP3
from pathlib import Path

from ._singleton import ActorId, run_in_thread_pool

logger = logging.getLogger(__name__)

@functools.lru_cache(maxsize=1)
def get_minimax_api() -> MinimaxApi:
    """Get the Minimax API instance."""
    return MinimaxApi(
        api_host=os.environ.get('MINIMAX_API_HOST', 'https://api.minimax.io'),
        api_key=os.environ['MINIMAX_API_KEY'],
        resource_mode="local"
    )

@run_in_thread_pool
def text2audio(*,actor: ActorId, text: str) -> (bytes, float):
    assert isinstance(actor, ActorId), f"Invalid actor: {actor}"
    api_res = get_minimax_api().text_to_audio(
        text=text,
        output_directory=f"{tempfile.gettempdir()}/minimax_tts",
        voice_id=actor.minimax_voice_id,
    )
    file_path = Path(api_res['data']['file_path'])
    logger.info("Audio file saved to %s", file_path)
    mp3_bytes = file_path.read_bytes()
    # mp3_bytes_len = len(mp3_bytes)

    mp3_audio_len = MP3(file_path).info.length
    file_path.unlink(missing_ok=True)
    return mp3_bytes, mp3_audio_len