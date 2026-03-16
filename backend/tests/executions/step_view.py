from django.urls import reverse
from rest_framework import status

from tests.base_api_test import BaseAPITestCase
from tests.factories.step_factory import StepFactory
from tests.factories.execution_factory import ExecutionFactory
from apps.executions.constants import ExecutionStatus


class StepViewSetTest(BaseAPITestCase):

    def setUp(self):
        super().setUp()

        self.execution = ExecutionFactory.create()

        self.step = StepFactory.create(
            execution=self.execution
        )

        self.list_url = reverse("step-list")
        self.detail_url = reverse(
            "step-detail",
            args=[self.step.id]
        )

    def test_list_steps(self):

        response = self.client.get(self.list_url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

    def test_retrieve_step(self):

        response = self.client.get(self.detail_url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

    def test_create_step(self):

        payload = {
            "execution": self.execution.id,
            "identification": "new_step",
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

    def test_update_step(self):

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
