from .session import SessionService, Session
from functools import cached_property
import os


class _DefaultServices:
    @cached_property
    def session(self):
        secret_key = os.environ["POLYPHRA_SESSION_SECRET"]
        return SessionService(secret_key=secret_key)


default_services = _DefaultServices()


__all__ = ["default_services", "Session"]
