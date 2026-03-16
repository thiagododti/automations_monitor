from django.test import TestCase

from apps.departments.api.serializers import DepartmentSerializer
from tests.factories.department_factory import DepartmentFactory


class DepartmentSerializerTest(TestCase):

    def test_read_serializer(self):
        department = DepartmentFactory.create()

        serializer = DepartmentSerializer(instance=department)

        self.assertEqual(serializer.data["name"], department.name)

    def test_valid_serializer(self):

        payload = {
            "name": "Financeiro",
            "description": "Departamento financeiro",
            "status": True
        }

        serializer = DepartmentSerializer(data=payload)

        self.assertTrue(serializer.is_valid())

    def test_read_only_fields(self):

        payload = {
            "name": "RH",
            "created_at": "2024-01-01T00:00:00Z"
        }

        serializer = DepartmentSerializer(data=payload)
        serializer.is_valid()

        self.assertNotIn("created_at", serializer.validated_data)
