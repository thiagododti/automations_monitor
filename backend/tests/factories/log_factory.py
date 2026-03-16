from apps.executions.models import Log
from tests.factories.execution_factory import ExecutionFactory


class LogFactory:

    @staticmethod
    def create(execution=None):

        if not execution:
            execution = ExecutionFactory.create()

        return Log.objects.create(
            execution=execution,
            description="log test"
        )
