from rest_framework import viewsets, mixins
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema
from rest_framework_simplejwt.authentication import JWTAuthentication

from apps.executions.models import Log
from apps.executions.api.serializers import LogSerializer
from apps.executions.api.filters import LogFilter


@extend_schema(
    tags=["Logs"],
    description="Operações de CRUD para Logs"
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


