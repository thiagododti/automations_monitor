from rest_framework import viewsets, mixins
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema_view, extend_schema, OpenApiResponse
from rest_framework.authtoken.models import Token
from apps.users.api.serializers import TokenSerializer, RegenerateTokenSerializer
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.decorators import action
from apps.users.api.filters import TokenFilter
from config.serializers import DefaultErrorSerializer
from rest_framework import status


@extend_schema(
    tags=["Tokens"],
    description="Operações de CRUD para Token"
)
@extend_schema_view(
    list=extend_schema(
        responses={
            200: TokenSerializer(many=True),
            401: OpenApiResponse(description="Não autenticado", response=DefaultErrorSerializer),
            403: OpenApiResponse(description="Sem permissão", response=DefaultErrorSerializer),
        }
    ),
    retrieve=extend_schema(
        responses={
            200: TokenSerializer,
            404: OpenApiResponse(description="Token não encontrado", response=DefaultErrorSerializer),
        }
    ),
    create=extend_schema(
        responses={
            201: TokenSerializer,
            400: OpenApiResponse(description="Erro de validação", response=DefaultErrorSerializer),
        }
    ),
)
class PermissionsTokenMixin(
    viewsets.GenericViewSet,
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    # mixins.DestroyModelMixin,
):
    pass


class AuthTokenViewSet(PermissionsTokenMixin):
    queryset = Token.objects.select_related('user').all()
    serializer_class = TokenSerializer
    filterset_class = TokenFilter
    lookup_field = "user_id"

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAuthenticated, IsAdminUser]

        return [permission() for permission in permission_classes]

    @extend_schema(
        request=RegenerateTokenSerializer,
        responses={200: TokenSerializer},
    )
    @action(detail=False, methods=["post"])
    def regenerate(self, request):
        serializer = RegenerateTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user_id = serializer.validated_data["user_id"]

        token = Token.objects.filter(user_id=user_id).first()

        if token:
            token.delete()

        new_token = Token.objects.create(user_id=user_id)

        return Response(self.get_serializer(new_token).data)
