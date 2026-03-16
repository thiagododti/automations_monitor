from django.db.models.signals import post_migrate
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from django.conf import settings
User = get_user_model()


@receiver(post_migrate)
def create_automation_user(sender, **kwargs):
    if not settings.TESTING:
        if not User.objects.filter(username="automation").exists():
            user = User.objects.create_user(
                username="automation",
                email="automation@email.com",
                password="senha123",
                first_name="Automation",
                last_name="User",
                telephone="0000000000",
                birthday="1990-01-01",
            )
            if user:
                print("Superuser 'automation' created successfully.")
                token, created = Token.objects.get_or_create(user=user)
                print(token.key)
