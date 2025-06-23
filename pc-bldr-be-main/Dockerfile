FROM python:3.12-slim
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1

ARG USER=user
ARG WORKDIR=/app

RUN apt-get update && apt-get install -y build-essential libpq-dev && rm -rf /var/lib/apt/lists/*

WORKDIR ${WORKDIR}

RUN useradd --system ${USER} && \
    chown --recursive ${USER} ${WORKDIR}

COPY --chown=${USER} requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY --chown=${USER} --chmod=555 . .
RUN ls -l /app/entrypoint.sh

USER ${USER}

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
