from rest_framework import viewsets, mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema_view, extend_schema, OpenApiResponse
from rest_framework_simplejwt.authentication import JWTAuthentication

from apps.automations.models import Automation
from apps.automations.api.serializers import AutomationSerializer, AutomationStatusSerializer
from config.serializers import DefaultErrorSerializer
from apps.automations.api.filters import AutomationFilter


@extend_schema(
    tags=['Automações'],
    description='Operações de CRUD para Automações',

)
@extend_schema_view(
    list=extend_schema(
        responses={
            200: AutomationSerializer(many=True),
            401: OpenApiResponse(description="Não autenticado", response=DefaultErrorSerializer),
            403: OpenApiResponse(description="Sem permissão", response=DefaultErrorSerializer),
        }
    ),
    retrieve=extend_schema(
        responses={
            200: AutomationSerializer,
            404: OpenApiResponse(description="Automação não encontrada", response=DefaultErrorSerializer),
        }
    ),
    create=extend_schema(
        responses={
            201: AutomationSerializer,
            400: OpenApiResponse(description="Erro de validação", response=DefaultErrorSerializer),
        }
    ),
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
        'updated_by', 'department', 'position').all()
    serializer_class = AutomationSerializer
    filterset_class = AutomationFilter
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
