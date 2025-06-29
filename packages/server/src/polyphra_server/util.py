from typing import Awaitable, ParamSpec, TypeVar, Callable

import functools
import logging
from concurrent.futures import ThreadPoolExecutor
import asyncio
import os


logger = logging.getLogger(__name__)

_thread_pool = ThreadPoolExecutor(max_workers=16)

R = TypeVar("R")
P = ParamSpec("P")


def run_in_thread_pool(func: Callable[P, R]) -> Callable[P, Awaitable[R]]:
    async def wrapper(*args: P.args, **kwargs: P.kwargs) -> Awaitable[R]:
        """Run a function in a thread pool and return an asyncio Future."""
        future = _thread_pool.submit(func, *args, **kwargs)
        return await asyncio.wrap_future(future)

    functools.update_wrapper(wrapper, func)
    return wrapper


@functools.lru_cache(maxsize=1)
def init_langfuse():
    secret_key = os.getenv("LANGFUSE_SECRET_KEY")
    public_key = os.getenv("LANGFUSE_PUBLIC_KEY")
    if secret_key and public_key:
        from langfuse import Langfuse

        return Langfuse(
            secret_key=secret_key,
            public_key=public_key,
            host=os.getenv("LANGFUSE_HOST", "https://us.cloud.langfuse.com"),
        )

    logger.warning("Langfuse not configured. Skipping Langfuse initialization")
    return None
