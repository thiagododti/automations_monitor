from django.test import TestCase
from tests.factories.log_factory import LogFactory


class LogModelTest(TestCase):

    def test_create_log(self):
        log = LogFactory.create()

        self.assertIsNotNone(log.id)
        self.assertIsNotNone(log.execution)

    def test_optional_description(self):
        log = LogFactory.create()
        log.description = None
        log.save()

        self.assertIsNone(log.description)

    def test_ordering(self):
        l1 = LogFactory.create()
        l2 = LogFactory.create()

        logs = list(type(l1).objects.all())

        self.assertGreaterEqual(
            logs[0].created_at,
            logs[1].created_at
        )
