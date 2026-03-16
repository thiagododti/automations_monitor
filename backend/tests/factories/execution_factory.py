from apps.executions.models import Execution
from tests.factories.automation_factory import AutomationFactory
from apps.executions.constants import ExecutionStatus


class ExecutionFactory:

    @staticmethod
    def create(automation=None):

        if not automation:
            automation = AutomationFactory.create()

        return Execution.objects.create(
            automation=automation,
            status=ExecutionStatus.INICIADO
        )
