FROM ghcr.io/astral-sh/uv:python3.13-trixie-slim

RUN apt-get update && apt-get install --yes make
COPY requirements.txt Makefile server.py /app/
COPY packages /app/packages

WORKDIR /app
RUN make deps

CMD ["venv/bin/fastapi", "run", "server.py"]
