from django.test import TestCase

from apps.users.api.serializers import (
    UserSerializer,
    UserReadSerializer,
)

from tests.factories.user_factory import UserFactory


class UserSerializerTest(TestCase):

    def test_user_read_serializer(self):

        user = UserFactory.create()

        serializer = UserReadSerializer(instance=user)

        self.assertEqual(serializer.data["username"], user.username)
        self.assertEqual(serializer.data["email"], user.email)

    def test_user_serializer_create_valid(self):

        payload = {
            "username": "new_user",
            "password": "S3nha#F0rte2026",
            "email": "new@test.com",
            "first_name": "New",
            "last_name": "User"
        }

        serializer = UserSerializer(data=payload)

        self.assertTrue(serializer.is_valid())
        user = serializer.save()
        self.assertTrue(user.check_password(payload["password"]))

    def test_user_serializer_update_password_hash(self):

        user = UserFactory.create()

        payload = {
            "password": "N0va#S3nhaForte2026"
        }

        serializer = UserSerializer(
            instance=user,
            data=payload,
            partial=True
        )

        self.assertTrue(serializer.is_valid(), serializer.errors)
        updated_user = serializer.save()
        self.assertTrue(updated_user.check_password(payload["password"]))

    def test_password_required_on_create(self):

        payload = {
            "username": "invalid_user",
            "email": "invalid@test.com",
        }

        serializer = UserSerializer(data=payload)

        self.assertFalse(serializer.is_valid())
        self.assertIn("password", serializer.errors)

    def test_password_not_required_on_update(self):

        user = UserFactory.create()

        payload = {
            "first_name": "Updated"
        }

        serializer = UserSerializer(
            instance=user,
            data=payload,
            partial=True
        )

        self.assertTrue(serializer.is_valid())
