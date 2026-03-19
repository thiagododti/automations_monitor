from django.urls import reverse
from rest_framework import status
from apps.users.models import User

from tests.base_api_test import BaseAPITestCase
from tests.factories.user_factory import UserFactory


class UserViewSetTest(BaseAPITestCase):

    def setUp(self):
        super().setUp()

        self.other_user = UserFactory.create()

        self.list_url = reverse("users-list")
        self.detail_url = reverse(
            "users-detail",
            args=[self.other_user.id]
        )

    def test_list_users(self):

        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_retrieve_user(self):

        response = self.client.get(self.detail_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["username"],
            self.other_user.username
        )

    def test_create_user(self):

        payload = {
            "username": "created_user",
            "password": "S3nha#F0rte2026",
            "email": "created@test.com",
            "first_name": "Created",
            "last_name": "User"
        }

        response = self.client.post(self.list_url, payload)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        created_user = User.objects.get(username=payload["username"])
        self.assertTrue(created_user.check_password(payload["password"]))

    def test_update_user(self):

        payload = {
            "first_name": "Updated"
        }

        response = self.client.patch(
            self.detail_url,
            payload
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_requires_authentication(self):

        self.client.force_authenticate(user=None)

        response = self.client.get(self.list_url)

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED
        )
