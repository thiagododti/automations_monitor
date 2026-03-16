from django.contrib.auth import get_user_model

User = get_user_model()


class UserFactory:

    counter = 0

    @classmethod
    def create(cls):
        cls.counter += 1

        return User.objects.create_user(
            username=f"user_{cls.counter}",
            password="12345678",
            email=f"user_{cls.counter}@test.com"
        )
