from .api_server import app
from ._singleton import init_langfuse

init_langfuse()
__names__ = ["app"]
