from django.urls import reverse
from rest_framework import status

from tests.base_api_test import BaseAPITestCase
from tests.factories.log_factory import LogFactory
from tests.factories.execution_factory import ExecutionFactory


class LogViewSetTest(BaseAPITestCase):

    def setUp(self):
        super().setUp()

        self.execution = ExecutionFactory.create()

        self.log = LogFactory.create(
            execution=self.execution
        )

        self.list_url = reverse("log-list")
        self.detail_url = reverse(
            "log-detail",
            args=[self.log.id]
        )

    def test_list_logs(self):

        response = self.client.get(self.list_url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

    def test_retrieve_log(self):

        response = self.client.get(self.detail_url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            response.data["description"],
            self.log.description
        )

    def test_create_log(self):

        payload = {
            "execution": self.execution.id,
            "description": "New log entry"
        }

        response = self.client.post(
            self.list_url,
            payload
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED
        )

    def test_update_log(self):

        payload = {
            "description": "Updated log"
        }

        response = self.client.patch(
            self.detail_url,
            payload
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

    def test_requires_authentication(self):

        self.client.force_authenticate(user=None)

        response = self.client.get(self.list_url)

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED
        )
