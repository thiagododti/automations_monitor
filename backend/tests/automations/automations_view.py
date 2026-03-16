from django.urls import reverse
from rest_framework import status

from tests.base_api_test import BaseAPITestCase
from tests.factories.automation_factory import AutomationFactory
from tests.factories.department_factory import DepartmentFactory


class AutomationViewSetTest(BaseAPITestCase):

    def setUp(self):
        super().setUp()

        self.department = DepartmentFactory.create(self.user)

        self.automation = AutomationFactory.create(
            user=self.user,
            department=self.department
        )

        self.list_url = reverse("automations-list")
        self.detail_url = reverse(
            "automations-detail",
            args=[self.automation.id]
        )

    def test_list_automations(self):

        response = self.client.get(self.list_url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

    def test_retrieve_automation(self):

        response = self.client.get(self.detail_url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            response.data["name"],
            self.automation.name
        )

    def test_create_automation(self):

        payload = {
            "name": "Nova Automação",
            "description": "Teste",
            "department": self.department.id,
            "manual_time": 100
        }

        response = self.client.post(
            self.list_url,
            payload
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED
        )

    def test_update_automation(self):

        payload = {
            "name": "Automation Atualizada"
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