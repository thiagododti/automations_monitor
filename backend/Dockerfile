FROM python:3.13.12-slim-trixie

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get install -y \
    tzdata \
    libpq-dev \
    netcat-openbsd \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/entrypoint.sh /app/backend/entrypoint.sh

COPY . .

RUN chmod +x /app/backend/entrypoint.sh

RUN mkdir -p /vol/web/media /vol/web/logs

ENTRYPOINT ["/app/backend/entrypoint.sh"]

CMD ["gunicorn","config.wsgi:application","--bind","0.0.0.0:3000","--workers","10","--threads","10","--timeout","60"]