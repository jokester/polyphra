import logging
import litellm
import langfuse
import os

from ..model import ActorId

logger = logging.getLogger(__name__)
logger.debug("paraphrase.py loaded")


@langfuse.observe()
async def llm_paraphrase(
    *, actor: ActorId, orig_text: str, model="vertex_ai/gemini-2.5-flash"
) -> str:
    res: litellm.ModelResponse = await litellm.acompletion(
        model=model,
        messages=[{"role": "user", "content": actor.to_paraphrase_prompt(orig_text)}],
        vertex_project=os.environ.get("GOOGLE_CLOUD_PROJECT")
    )
    return res.choices[0].message.content
