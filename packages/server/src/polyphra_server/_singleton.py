from typing import TypeVar, Callable, Any

from enum import StrEnum
import functools
import logging
from fastapi import FastAPI
from concurrent.futures import ThreadPoolExecutor
import asyncio
import os


logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

app = FastAPI()

logger.info("FastAPI app created")


class ActorId(StrEnum):
    the_blonde_winner = "the_blonde_winner"
    the_chicken_guy = "the_chicken_guy"

    @property
    def minimax_voice_id(self) -> str:
        match self:
            case ActorId.the_blonde_winner:
                return "the_blonde_winner_1"
            # case ActorId.the_chicken_guy:
                # return "the_chicken_guy"
            case _:
                raise ValueError(f"Unknown actor: {self}")

    def to_paraphrase_prompt(self, orig_text: str) -> str:
        match self:
            case ActorId.the_blonde_winner:
                return f"""
Please rephrase the following text to match Donald Trump's distinctive speaking style. Apply these characteristics:

VOCABULARY & TONE:
- Use simple, direct language (avoid complex or academic terms)
- Employ superlatives frequently ("tremendous," "incredible," "fantastic," "terrible," "disaster")
- Use binary/absolute language ("winning/losing," "best/worst," "great/bad")
- Include emphatic words ("very," "so," "really," "totally")

SENTENCE STRUCTURE:
- Keep sentences short and punchy
- Use repetition for emphasis
- Include parenthetical asides and tangents
- Add conversational fillers ("you know," "believe me," "by the way")

RHETORICAL STYLE:
- Make bold, confident assertions
- Use personal anecdotes or references
- Include crowd-pleasing phrases
- Appeal to emotion over detailed analysis
- Use vivid, memorable imagery

TONE:
- Sound conversational and informal
- Express strong opinions confidently
- Use persuasive, sales-like language
- Include occasional braggadocio

Original text: {orig_text} """
            case ActorId.the_chicken_guy:
                return f"""
Rephrase the following text to match Gus Fring's distinctive speaking style from Breaking Bad/Better Call Saul. Apply these characteristics:

VOCABULARY & TONE:
- Use precise, measured language with careful word selection
- Employ formal, professional vocabulary
- Speak with restraint and control
- Use business/corporate terminology when applicable

SENTENCE STRUCTURE:
- Construct deliberate, well-structured sentences
- Speak slowly and methodically
- Use pauses for emphasis and intimidation
- Keep statements concise but complete

SPEECH PATTERNS:
- Maintain perfect grammar and pronunciation
- Use subtle threats disguised as polite conversation
- Employ indirect communication and subtext
- Include courteous phrases that feel slightly menacing

RHETORICAL STYLE:
- Sound calm and collected, even when discussing serious matters
- Use metaphors related to business, cooking, or family
- Speak with quiet authority and confidence
- Layer multiple meanings into seemingly innocent statements
- Reference respect, loyalty, and consequences obliquely

TONE:
- Maintain surface-level politeness with underlying steel
- Sound reasonable while being subtly intimidating
- Use a helpful, almost paternal manner that feels calculated
- Express disappointment rather than anger when addressing problems

Original text: {orig_text}

Rephrased version:"""
            case _:
                raise ValueError(f"Unknown actor: {self}")



_thread_pool = ThreadPoolExecutor(max_workers=16)

_T = TypeVar("_T")


async def run_in_thread_pool(func: Callable[..., _T], *args: Any, **kwargs: Any) -> _T:
    future = _thread_pool.submit(func, *args, **kwargs)
    return await asyncio.wrap_future(future)


@functools.lru_cache(maxsize=1)
def init_langfuse():
    secret_key = os.getenv("LANGFUSE_SECRET_KEY")
    public_key = os.getenv("LANGFUSE_PUBLIC_KEY")
    if secret_key and public_key:
        from langfuse import Langfuse

        return Langfuse(
            secret_key=secret_key,
            public_key=public_key,
            host=os.getenv('LANGFUSE_HOST', "https://us.cloud.langfuse.com"),
        )

    logger.warning("Skipping Langfuse initialization")
    return None