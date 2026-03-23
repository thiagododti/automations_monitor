from rest_framework import viewsets, mixins
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema_view, extend_schema, OpenApiResponse
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

from apps.business.models import Business
from apps.business.api.serializers import BusinessSerializer, BusinessOptionSerializer
from apps.business.api.filters import BusinessFilter
from config.serializers import DefaultErrorSerializer


@extend_schema(
    tags=['Empresa'],
    description='Operações de CRUD para Empresas'
)
@extend_schema_view(
    list=extend_schema(
        responses={
            200: BusinessSerializer(many=True),
            401: OpenApiResponse(description="Não autenticado", response=DefaultErrorSerializer),
            403: OpenApiResponse(description="Sem permissão", response=DefaultErrorSerializer),
        }
    ),
    retrieve=extend_schema(
        responses={
            200: BusinessSerializer,
            404: OpenApiResponse(description="Empresa não encontrada", response=DefaultErrorSerializer),
        }
    ),
    create=extend_schema(
        responses={
            201: BusinessSerializer,
            400: OpenApiResponse(description="Erro de validação", response=DefaultErrorSerializer),
        }
    ),
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
    filterset_class = BusinessFilter
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
