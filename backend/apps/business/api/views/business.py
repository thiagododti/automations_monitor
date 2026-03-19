from rest_framework import viewsets, mixins
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

from apps.business.models import Business
from apps.business.api.serializers import BusinessSerializer, BusinessOptionSerializer
from apps.business.api.filters import BusinessFilterSet


@extend_schema(
    tags=['Empresa'],
    description='Operações de CRUD para Empresas'
)
class PermissionsBusinessMixin(
    viewsets.GenericViewSet,
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    # mixins.DestroyModelMixin,
):
    pass


class BusinessViewSet(PermissionsBusinessMixin):
    queryset = Business.objects.all()
    serializer_class = BusinessSerializer
    filterset_class = BusinessFilterSet
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(updated_by=self.request.user)

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)

    @extend_schema(
        responses=BusinessOptionSerializer(many=True)
    )
    @action(detail=False, methods=['get'], url_path='options', pagination_class=None)
    def select_businesses(self, request):
        queryset = self.get_queryset()
        serializer = BusinessOptionSerializer(queryset, many=True)
        return Response(serializer.data)
