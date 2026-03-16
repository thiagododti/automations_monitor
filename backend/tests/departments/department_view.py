from django.urls import reverse
from rest_framework import status

from tests.base_api_test import BaseAPITestCase
from tests.factories.department_factory import DepartmentFactory


class DepartmentViewSetTest(BaseAPITestCase):

    def setUp(self):
        super().setUp()

        self.department = DepartmentFactory.create()

        self.list_url = reverse("departments-list")
        self.detail_url = reverse(
            "departments-detail",
            args=[self.department.id]
        )

    def test_list_departments(self):

        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_retrieve_department(self):

        response = self.client.get(self.detail_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["name"],
            self.department.name
        )

    def test_create_department(self):

        payload = {
            "name": "TI",
            "description": "Tecnologia",
            "status": True
        }

        response = self.client.post(self.list_url, payload)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_update_department(self):

        payload = {
            "name": "Departamento Atualizado"
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
