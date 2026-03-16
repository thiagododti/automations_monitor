from django.test import TestCase

from apps.executions.api.serializers import LogSerializer
from tests.factories.log_factory import LogFactory


class LogSerializerTest(TestCase):

    def test_read_serializer(self):
        log = LogFactory.create()

        serializer = LogSerializer(instance=log)

        self.assertEqual(
            serializer.data["execution"],
            log.execution.id
        )

    def test_valid_serializer(self):

        log = LogFactory.create()

        payload = {
            "execution": log.execution.id,
            "description": "New log"
        }

        serializer = LogSerializer(data=payload)

        self.assertTrue(serializer.is_valid())

    def test_read_only_fields(self):

        log = LogFactory.create()

        payload = {
            "execution": log.execution.id,
            "description": "Test log",
            "created_at": "2024-01-01T00:00:00Z"
        }

        serializer = LogSerializer(data=payload)
        serializer.is_valid()

        self.assertNotIn(
            "created_at",
            serializer.validated_data
        )
