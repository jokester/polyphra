FROM ghcr.io/astral-sh/uv:python3.11-trixie-slim

COPY requirements.txt Makefile server.py packages /app/

WORKDIR /app
RUN make deps

CMD venv/bin/fastapi run server.py