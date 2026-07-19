# @jearle/util-llm

Neutral utilities for LLM providers, chat payloads, streaming responses, and
embeddings.

The `chat-message-text` feature extracts text from role-based chat message
arrays. It returns per-message text records plus a combined chat message text
string, and keeps provider- or workflow-specific policy out of the utility.
