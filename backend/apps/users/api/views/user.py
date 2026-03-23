from rest_framework import viewsets, mixins
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.users.models import User
from apps.users.api.serializers import UserSerializer, UserReadSerializer
from apps.users.api.filters import UserFilter
from drf_spectacular.utils import extend_schema_view, extend_schema, OpenApiResponse
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.parsers import MultiPartParser, FormParser
from config.serializers import DefaultErrorSerializer


@extend_schema(
    tags=["Usuários"],  # esta será a seção/grupo no Swagger
    description="Operações de CRUD para usuários."
)
@extend_schema_view(
    list=extend_schema(
        responses={
            200: UserReadSerializer(many=True),
            401: OpenApiResponse(description="Não autenticado", response=DefaultErrorSerializer),
            403: OpenApiResponse(description="Sem permissão", response=DefaultErrorSerializer),
        }
    ),
    retrieve=extend_schema(
        responses={
            200: UserReadSerializer,
            404: OpenApiResponse(description="Usuário não encontrado", response=DefaultErrorSerializer),
        }
    ),
    create=extend_schema(
        responses={
            201: UserSerializer,
            400: OpenApiResponse(description="Erro de validação", response=DefaultErrorSerializer),
        }
    ),
)
class PermissionsUserMixin(
    viewsets.GenericViewSet,
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    # mixins.DestroyModelMixin,
):
    pass


class UserViewSet(PermissionsUserMixin):
    queryset = User.objects.select_related('department').all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    # opcional, se você usar TokenAuth
    # authentication_classes = [JWTAuthentication]
    filterset_class = UserFilter
    parser_classes = [MultiPartParser]

    def perform_create(self, serializer):
        serializer.save(updated_by=self.request.user)

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return UserReadSerializer
        return UserSerializer
