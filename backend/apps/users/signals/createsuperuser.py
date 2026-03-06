from django.db.models.signals import post_migrate
from django.dispatch import receiver
from django.contrib.auth import get_user_model

User = get_user_model()


@receiver(post_migrate)
def create_superuser(sender, **kwargs):
    if not User.objects.filter(username="admin").exists():
        user = User.objects.create_superuser(
            username="admin",
            email="admin@email.com",
            password="admin123",
            first_name="Admin",
            last_name="User",
            telephone="1234567890",
            birthday="1990-01-01",
        )
        if user:
            print("Superuser 'admin' created successfully.")
