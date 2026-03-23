from rest_framework import viewsets, mixins
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema_view, extend_schema, OpenApiResponse
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

from apps.departments.models import Department
from apps.departments.api.serializers import DepartmentSerializer, DepartmentOptionSerializer
from apps.departments.api.filters import DepartmentFilter
from config.serializers import DefaultErrorSerializer


@extend_schema(
    tags=['Departamento'],
    description='Operações de CRUD para Departamento'
)
@extend_schema_view(
    list=extend_schema(
        responses={
            200: DepartmentSerializer(many=True),
            401: OpenApiResponse(description="Não autenticado", response=DefaultErrorSerializer),
            403: OpenApiResponse(description="Sem permissão", response=DefaultErrorSerializer),
        }
    ),
    retrieve=extend_schema(
        responses={
            200: DepartmentSerializer,
            404: OpenApiResponse(description="Departamento não encontrado", response=DefaultErrorSerializer),
        }
    ),
    create=extend_schema(
        responses={
            201: DepartmentSerializer,
            400: OpenApiResponse(description="Erro de validação", response=DefaultErrorSerializer),
        }
    ),
)
class PermissionsDepartmentMixin(
    viewsets.GenericViewSet,
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    # mixins.DestroyModelMixin,
):
    pass


class DepartmentViewSet(PermissionsDepartmentMixin):
    queryset = Department.objects.select_related(
        'updated_by').all()
    serializer_class = DepartmentSerializer
    filterset_class = DepartmentFilter
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(updated_by=self.request.user)

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)

    @extend_schema(
        responses=DepartmentOptionSerializer(many=True)
    )
    @action(detail=False, methods=['get'], url_path='options', pagination_class=None)
    def select_departments(self, request):
        queryset = self.get_queryset()
        serializer = DepartmentOptionSerializer(queryset, many=True)
        return Response(serializer.data)
