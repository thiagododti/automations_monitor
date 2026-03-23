from rest_framework import viewsets, mixins
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema_view, extend_schema, OpenApiResponse

from rest_framework_simplejwt.authentication import JWTAuthentication
from config.serializers import DefaultErrorSerializer

from apps.executions.models import Execution
from apps.executions.api.serializers import ExecutionSerializer
from apps.executions.api.filters import ExecutionFilter


@extend_schema(
    tags=["Execução"],
    description="Operações de CRUD para Execução"
)
@extend_schema_view(
    list=extend_schema(
        responses={
            200: ExecutionSerializer(many=True),
            401: OpenApiResponse(description="Não autenticado", response=DefaultErrorSerializer),
            403: OpenApiResponse(description="Sem permissão", response=DefaultErrorSerializer),
        }
    ),
    retrieve=extend_schema(
        responses={
            200: ExecutionSerializer,
            404: OpenApiResponse(description="Execução não encontrada", response=DefaultErrorSerializer),
        }
    ),
    create=extend_schema(
        responses={
            201: ExecutionSerializer,
            400: OpenApiResponse(description="Erro de validação", response=DefaultErrorSerializer),
        }
    ),
)
class PermissionsExecutionMixin(
    viewsets.GenericViewSet,
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    # mixins.DestroyModelMixin,
):
    pass


class ExecutionViewSet(PermissionsExecutionMixin):
    queryset = Execution.objects.select_related("automation", "business").all()
    serializer_class = ExecutionSerializer
    filterset_class = ExecutionFilter
    permission_classes = [IsAuthenticated]
