from django.test import TestCase

from apps.executions.api.serializers import ExecutionSerializer
from tests.factories.execution_factory import ExecutionFactory
from apps.executions.constants import ExecutionStatus


class ExecutionSerializerTest(TestCase):

    def test_read_serializer(self):
        execution = ExecutionFactory.create()

        serializer = ExecutionSerializer(instance=execution)

        self.assertEqual(
            serializer.data["automation"],
            execution.automation.id
        )

    def test_valid_serializer(self):

        execution = ExecutionFactory.create()

        payload = {
            "automation": execution.automation.id,
            "status": ExecutionStatus.INICIADO
        }

        serializer = ExecutionSerializer(data=payload)

        self.assertTrue(serializer.is_valid())

    def test_read_only_fields(self):

        execution = ExecutionFactory.create()

        payload = {
            "automation": execution.automation.id,
            "status": ExecutionStatus.INICIADO,
            "date_start": "2024-01-01T00:00:00Z"
        }

        serializer = ExecutionSerializer(data=payload)
        serializer.is_valid()

        self.assertNotIn(
            "date_start",
            serializer.validated_data
        )
