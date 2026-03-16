from django.test import TestCase

from apps.executions.api.serializers import StepSerializer
from tests.factories.step_factory import StepFactory
from apps.executions.constants import ExecutionStatus


class StepSerializerTest(TestCase):

    def test_read_serializer(self):
        step = StepFactory.create()

        serializer = StepSerializer(instance=step)

        self.assertEqual(
            serializer.data["execution"],
            step.execution.id
        )

    def test_valid_serializer(self):

        step = StepFactory.create()

        payload = {
            "execution": step.execution.id,
            "identification": "step_test",
            "status": ExecutionStatus.INICIADO
        }

        serializer = StepSerializer(data=payload)

        self.assertTrue(serializer.is_valid())

    def test_read_only_fields(self):

        step = StepFactory.create()

        payload = {
            "execution": step.execution.id,
            "status": ExecutionStatus.INICIADO,
            "date_start": "2024-01-01T00:00:00Z"
        }

        serializer = StepSerializer(data=payload)
        serializer.is_valid()

        self.assertNotIn(
            "date_start",
            serializer.validated_data
        )
