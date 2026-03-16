
from django.test import TestCase
from tests.factories.execution_factory import ExecutionFactory
from apps.executions.constants import ExecutionStatus


class ExecutionModelTest(TestCase):

    def test_create_execution(self):
        execution = ExecutionFactory.create()

        self.assertIsNotNone(execution.id)
        self.assertEqual(execution.status, ExecutionStatus.INICIADO)

    def test_str_method(self):
        execution = ExecutionFactory.create()

        self.assertEqual(str(execution), str(execution.automation))

    def test_optional_date_end(self):
        execution = ExecutionFactory.create()

        self.assertIsNone(execution.date_end)

    def test_ordering(self):
        e1 = ExecutionFactory.create()
        e2 = ExecutionFactory.create()

        executions = list(type(e1).objects.all())

        self.assertGreaterEqual(
            executions[0].date_start,
            executions[1].date_start
        )
