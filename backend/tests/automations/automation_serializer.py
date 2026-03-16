from django.test import TestCase

from apps.automations.api.serializers import AutomationSerializer
from tests.factories.automation_factory import AutomationFactory


class AutomationSerializerTest(TestCase):

    def test_read_serializer(self):
        automation = AutomationFactory.create()

        serializer = AutomationSerializer(instance=automation)

        self.assertEqual(
            serializer.data["name"],
            automation.name
        )

        self.assertIsNotNone(serializer.data["department_data"])

    def test_valid_serializer(self):

        payload = {
            "name": "Nova Automação",
            "description": "Teste",
            "is_active": True,
            "manual_time": 120
        }

        serializer = AutomationSerializer(data=payload)

        self.assertTrue(serializer.is_valid())

    def test_read_only_fields(self):

        payload = {
            "name": "Teste",
            "created_at": "2024-01-01T00:00:00Z"
        }

        serializer = AutomationSerializer(data=payload)
        serializer.is_valid()

        self.assertNotIn(
            "created_at",
            serializer.validated_data
        )