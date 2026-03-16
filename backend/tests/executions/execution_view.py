from django.urls import reverse
from rest_framework import status

from tests.base_api_test import BaseAPITestCase
from tests.factories.execution_factory import ExecutionFactory
from tests.factories.automation_factory import AutomationFactory
from apps.executions.constants import ExecutionStatus


class ExecutionViewSetTest(BaseAPITestCase):

    def setUp(self):
        super().setUp()

        self.automation = AutomationFactory.create(user=self.user)

        self.execution = ExecutionFactory.create(
            automation=self.automation
        )

        self.list_url = reverse("execution-list")
        self.detail_url = reverse(
            "execution-detail",
            args=[self.execution.id]
        )

    def test_list_executions(self):

        response = self.client.get(self.list_url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

    def test_retrieve_execution(self):

        response = self.client.get(self.detail_url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

    def test_create_execution(self):

        payload = {
            "automation": self.automation.id,
            "status": ExecutionStatus.INICIADO
        }

        response = self.client.post(
            self.list_url,
            payload
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED
        )

    def test_update_execution(self):

        payload = {
            "status": ExecutionStatus.CONCLUIDO
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
