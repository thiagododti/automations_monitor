from rest_framework import viewsets, mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema
from rest_framework_simplejwt.authentication import JWTAuthentication

from apps.automations.models import Automation
from apps.automations.api.serializers import AutomationSerializer, AutomationStatusSerializer
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
    # authentication_classes = [JWTAuthentication]

    def perform_create(self, serializer):
        serializer.save(updated_by=self.request.user)

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user
                        )

    @extend_schema(
        responses=AutomationStatusSerializer(many=True)
    )
    @action(detail=False, methods=['get'], url_path='status', pagination_class=None)
    def status(self, request):
        from django.db.models import OuterRef, Subquery
        from apps.executions.models import Execution

        last_execution = Execution.objects.filter(
            automation=OuterRef('pk')
        ).order_by('-date_start')

        queryset = self.get_queryset().annotate(
            last_status=Subquery(last_execution.values('status')[:1]),
            last_date_start=Subquery(last_execution.values('date_start')[:1]),
            last_date_end=Subquery(last_execution.values('date_end')[:1]),
            last_execution_id=Subquery(last_execution.values('id')[:1]),
        )

        serializer = AutomationStatusSerializer(queryset, many=True)
        return Response(serializer.data)
