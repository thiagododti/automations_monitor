from rest_framework import viewsets, mixins
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema
from rest_framework_simplejwt.authentication import JWTAuthentication

from apps.executions.models import Step
from apps.executions.api.serializers import StepSerializer
from apps.executions.api.filters import StepFilterSet
from django.db.models import F


@extend_schema(
    tags=["Etapas"],
    description="Operações de CRUD para Etapas"
)
class PermissionsStepMixin(
    viewsets.GenericViewSet,
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    # mixins.DestroyModelMixin,
):
    pass


class StepViewSet(PermissionsStepMixin):
    queryset = Step.objects.select_related('execution').all()
    serializer_class = StepSerializer
    filterset_class = StepFilterSet
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        from apps.executions.models import Execution
        step = serializer.save()

        Execution.objects.filter(id=step.execution_id).update(
            step_counts=F('step_counts') + 1
        )

    def perform_update(self, serializer):
        from apps.executions.models import Execution
        from apps.executions.constants import ExecutionStatus
        old_instance = self.get_object()
        step = serializer.save()

        if (
            old_instance.status != ExecutionStatus.CONCLUIDO and step.status == ExecutionStatus.CONCLUIDO
        ):
            Execution.objects.filter(id=step.execution_id).update(
                success_count=F('success_count') + 1
            )
