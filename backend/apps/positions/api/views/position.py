from rest_framework import viewsets, mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema_view, extend_schema, OpenApiResponse
from rest_framework_simplejwt.authentication import JWTAuthentication

from apps.positions.models import Position, nivel_choices
from apps.positions.api.serializers import PositionSerializer, PositionOptionsSerializer
from apps.positions.api.filters import PositionFilter
from config.serializers import DefaultErrorSerializer


@extend_schema(
    tags=['Cargos'],
    description='Operações de CRUD para Cargos'
)
@extend_schema_view(
    list=extend_schema(
        responses={
            200: PositionSerializer(many=True),
            401: OpenApiResponse(description="Não autenticado", response=DefaultErrorSerializer),
            403: OpenApiResponse(description="Sem permissão", response=DefaultErrorSerializer),
        }
    ),
    retrieve=extend_schema(
        responses={
            200: PositionSerializer,
            404: OpenApiResponse(description="Cargo não encontrado", response=DefaultErrorSerializer),
        }
    ),
    create=extend_schema(
        responses={
            201: PositionSerializer,
            400: OpenApiResponse(description="Erro de validação", response=DefaultErrorSerializer),
        }
    ),
)
class PermissionsPositionMixin(
    viewsets.GenericViewSet,
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    # mixins.DestroyModelMixin,
):
    pass


class PositionViewSet(PermissionsPositionMixin):
    queryset = Position.objects.all()
    serializer_class = PositionSerializer
    filterset_class = PositionFilter
    permission_classes = [IsAuthenticated]

    @extend_schema(
        responses=PositionOptionsSerializer
    )
    @action(detail=False, methods=['get'], url_path='options', pagination_class=None)
    def select_positions(self, request):
        queryset = self.get_queryset()
        serializer = PositionOptionsSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='nivel', pagination_class=None)
    def nivel_choices(self, request):
        choices = [{'value': choice[0], 'display': choice[1]}
                   for choice in nivel_choices]
        return Response(choices)
