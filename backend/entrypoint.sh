#!/bin/sh

echo "Aguardando banco de dados..."

while ! nc -z $POSTGRES_HOST $POSTGRES_PORT; do
  sleep 1
done

echo "Banco disponível."

python manage.py migrate --noinput

python manage.py createsuperuser \
  --noinput \
  --username "$DJANGO_SUPERUSER_USERNAME" \
  --email "$DJANGO_SUPERUSER_EMAIL" || true

python manage.py collectstatic --noinput

exec "$@"
