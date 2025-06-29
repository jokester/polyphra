FROM python:3.12-slim

COPY requirements.txt Makefile server.py /app/
COPY packages /app/packages
WORKDIR /app
RUN python3 -mvenv venv && venv/bin/pip install -r requirements.txt --no-cache-dir

CMD venv/bin/fastapi run server.py