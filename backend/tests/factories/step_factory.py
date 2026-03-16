from apps.executions.models import Step
from tests.factories.execution_factory import ExecutionFactory
from apps.executions.constants import ExecutionStatus


class StepFactory:

    @staticmethod
    def create(execution=None):

        if not execution:
            execution = ExecutionFactory.create()

        return Step.objects.create(
            execution=execution,
            identification="step_test",
            status=ExecutionStatus.INICIADO
        )
