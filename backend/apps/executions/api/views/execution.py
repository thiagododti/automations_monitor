from rest_framework import viewsets, mixins
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema
from rest_framework_simplejwt.authentication import JWTAuthentication

from apps.executions.models import Execution
from apps.executions.api.serializers import ExecutionSerializer
from apps.executions.api.filters import ExecutionFilterSet

@extend_schema(
    tags=["Execução"],
    description="Operações de CRUD para Execução"
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
    queryset = Execution.objects.select_related("automation").all()
    serializer_class = ExecutionSerializer
    filterset_class = ExecutionFilterSet
    permission_classes = [IsAuthenticated]

    

