from rest_framework import viewsets, mixins
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema_view, extend_schema, OpenApiResponse
from rest_framework_simplejwt.authentication import JWTAuthentication

from apps.executions.models import Log
from apps.executions.api.serializers import LogSerializer
from config.serializers import DefaultErrorSerializer
from apps.executions.api.filters import LogFilter


@extend_schema(
    tags=["Logs"],
    description="Operações de CRUD para Logs"
)
@extend_schema_view(
    list=extend_schema(
        responses={
            200: LogSerializer(many=True),
            401: OpenApiResponse(description="Não autenticado", response=DefaultErrorSerializer),
            403: OpenApiResponse(description="Sem permissão", response=DefaultErrorSerializer),
        }
    ),
    retrieve=extend_schema(
        responses={
            200: LogSerializer,
            404: OpenApiResponse(description="Log não encontrado", response=DefaultErrorSerializer),
        }
    ),
    create=extend_schema(
        responses={
            201: LogSerializer,
            400: OpenApiResponse(description="Erro de validação", response=DefaultErrorSerializer),
        }
    ),
)
class PermissionsLogMixin(
    viewsets.GenericViewSet,
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    # mixins.DestroyModelMixin,
):
    pass


class LogViewSet(PermissionsLogMixin):
    queryset = Log.objects.select_related('execution').all()
    serializer_class = LogSerializer
    filterset_class = LogFilter
    permission_classes = [IsAuthenticated]
