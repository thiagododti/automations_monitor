from datetime import timedelta
from django.utils import timezone

from apps.executions.models import Execution, Step
from apps.executions.constants import ExecutionStatus


def check_stuck_executions():
    print("Verificando execuções travadas...")
    timeout = timezone.now() - timedelta(minutes=30)
    print(
        f"Considerando execuções iniciadas antes de {timeout} como travadas.")

    stuck_executions = Execution.objects.filter(
        status=ExecutionStatus.INICIADO,
        date_end__isnull=True,
        last_update__lt=timeout,
    )
    print(f"{stuck_executions.count()} execuções travadas encontradas.")

    execution_ids = stuck_executions.values_list("id", flat=True)

    steps_stucks = Step.objects.filter(
        execution_id__in=execution_ids,
        date_end__isnull=True,
    ).update(status=ExecutionStatus.ERRO)
    if steps_stucks > 0:
        print(f"{steps_stucks} steps travados foram atualizados para erro.")

    exec_stuck = stuck_executions.update(
        status=ExecutionStatus.ERRO,
        date_end=timezone.now()
    )
    if stuck_executions.exists():
        print(
            f"{stuck_executions.count()} execuções travadas foram atualizadas para erro.")
