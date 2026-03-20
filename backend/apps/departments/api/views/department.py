from rest_framework import viewsets, mixins
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

from apps.departments.models import Department
from apps.departments.api.serializers import DepartmentSerializer, DepartmentOptionSerializer
from apps.departments.api.filters import DepartmentFilter


@extend_schema(
    tags=['Departamento'],
    description='Operações de CRUD para Departamento'
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
