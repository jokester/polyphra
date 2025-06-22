import logging
import litellm
import langfuse

from ._singleton import ActorId

logger = logging.getLogger(__name__)
logger.debug("paraphrase.py loaded")


@langfuse.observe()
async def llm_paraphrase(
    *, actor: ActorId, orig_text: str, model="vertex_ai/gemini-2.5-flash"
) -> str:
    res: litellm.ModelResponse = await litellm.acompletion(
        model=model,
        messages=[{"role": "user", "content": actor.to_paraphrase_prompt(orig_text)}],
    )
    return res.choices[0].message.content
