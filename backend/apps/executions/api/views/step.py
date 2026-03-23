from rest_framework import viewsets, mixins
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema_view, extend_schema, OpenApiResponse
from rest_framework_simplejwt.authentication import JWTAuthentication

from apps.executions.models import Step
from apps.executions.api.serializers import StepSerializer
from apps.executions.api.filters import StepFilter
from django.db.models import F
from config.serializers import DefaultErrorSerializer


@extend_schema(
    tags=["Etapas"],
    description="Operações de CRUD para Etapas"
)
@extend_schema_view(
    list=extend_schema(
        responses={
            200: StepSerializer(many=True),
            401: OpenApiResponse(description="Não autenticado", response=DefaultErrorSerializer),
            403: OpenApiResponse(description="Sem permissão", response=DefaultErrorSerializer),
        }
    ),
    retrieve=extend_schema(
        responses={
            200: StepSerializer,
            404: OpenApiResponse(description="Etapa não encontrada", response=DefaultErrorSerializer),
        }
    ),
    create=extend_schema(
        responses={
            201: StepSerializer,
            400: OpenApiResponse(description="Erro de validação", response=DefaultErrorSerializer),
        }
    ),
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
    filterset_class = StepFilter
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
            step.status in [ExecutionStatus.CONCLUIDO, ExecutionStatus.ALERTA]
            and old_instance.status != step.status
        ):
            Execution.objects.filter(id=step.execution_id).update(
                success_count=F('success_count') + 1
            )
        elif (
            step.status == ExecutionStatus.ERRO and old_instance.status != step.status
        ):
            Execution.objects.filter(id=step.execution_id).update(
                error_count=F('error_count') + 1
            )
