from rest_framework import viewsets, mixins
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema
from rest_framework_simplejwt.authentication import JWTAuthentication

from apps.executions.models import Step
from apps.executions.api.serializers import StepSerializer
from apps.executions.api.filters import StepFilterSet


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


