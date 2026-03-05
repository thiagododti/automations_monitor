from rest_framework import viewsets, mixins
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.users.models import User
from apps.users.api.serializers import UserSerializer, UserReadSerializer
from apps.users.api.filters import UserFilterSet
from drf_spectacular.utils import extend_schema
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.parsers import MultiPartParser, FormParser


@extend_schema(
    tags=["Usuario"],  # esta será a seção/grupo no Swagger
    description="Operações de CRUD para usuários."
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
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)
    # opcional, se você usar TokenAuth
    authentication_classes = [JWTAuthentication]
    filterset_class = UserFilterSet
    parser_classes = [MultiPartParser]

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return UserReadSerializer
        return UserSerializer
