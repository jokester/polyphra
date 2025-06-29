from .session import SessionService, Session
from .minimax_tts import text2audio
from .gemini_paraphrase import llm_paraphrase
from functools import cached_property
import os


class _DefaultServices:
    @cached_property
    def session(self):
        secret_key = os.environ["POLYPHRA_SESSION_SECRET"]
        return SessionService(secret_key=secret_key)

    @cached_property
    def text2audio(self):
        return text2audio

    @cached_property
    def paraphrase_text(self):
        return llm_paraphrase


default_services = _DefaultServices()


__all__ = ["default_services", "Session"]
