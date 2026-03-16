from rest_framework import viewsets, mixins
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema
from rest_framework_simplejwt.authentication import JWTAuthentication

from apps.automations.models import Automation
from apps.automations.api.serializers import AutomationSerializer
from apps.automations.api.filters import AutomationFilterSet


@extend_schema(
    tags=['Automações'],
    description='Operações de CRUD para Automações'
)
class PermissionsAutomationMixin(
    viewsets.GenericViewSet,
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    # mixins.DestroyModelMixin,
):
    pass


class AutomationViewSet(PermissionsAutomationMixin):
    queryset = Automation.objects.select_related(
        'updated_by', 'department').all()
    serializer_class = AutomationSerializer
    filterset_class = AutomationFilterSet
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def perform_create(self, serializer):
        serializer.save(updated_by=self.request.user)

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user
                        )
