from rest_framework import viewsets, mixins
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from drf_spectacular.utils import extend_schema_view, extend_schema, OpenApiResponse
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication
from config.serializers import DefaultErrorSerializer

from apps.executions.models import Execution
from apps.executions.api.serializers import ExecutionSerializer, ClearTestExecutionsSerializer
from apps.executions.api.filters import ExecutionFilter
from rest_framework.decorators import action
from apps.executions.constants import ExecutionStatus
from rest_framework.response import Response


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

    @extend_schema(
        request=ClearTestExecutionsSerializer,
        responses={
            200: OpenApiResponse(description="Exclusão concluída com sucesso"),
            400: OpenApiResponse(description="Erro de validação", response=DefaultErrorSerializer),
        }

    )
    @action(detail=False, methods=['post'], url_path='clear-test-executions', permission_classes=[IsAuthenticated, IsAdminUser])
    def clear_test_executions(self, request):
        serializer = ClearTestExecutionsSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        automation_id = serializer.validated_data["automation_id"]
        print(f"Automation ID recebido para exclusão: {automation_id}")

        if automation_id is None:
            return Response({
                "message": "O campo 'automation_id' é obrigatório."
            }, status=status.HTTP_400_BAD_REQUEST)
        else:
            deleted_count, _ = Execution.objects.filter(
                automation_id=automation_id,
                status=ExecutionStatus.TESTE
            ).delete()

        return Response({
            "detail": f"Exclusão concluída. Total de execuções de teste excluídas: {deleted_count}."
        })
