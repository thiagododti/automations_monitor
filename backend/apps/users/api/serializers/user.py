from rest_framework import serializers
from apps.users.models import User


class UserReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'last_login',
            'is_superuser',
            'username',
            'first_name',
            'last_name',
            'email',
            'is_staff',
            'is_active',
            'date_joined',
            'telephone',
            'birthday',
            'photo'
        ]


class UserSerializer(UserReadSerializer):
    password = serializers.CharField(
        write_only=True,
        required=False,
        min_length=8,
        style={'input_type': 'password'}
    )

    class Meta(UserReadSerializer.Meta):
        fields = UserReadSerializer.Meta.fields + ['password']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance:
            # Atualização: senha não é obrigatória
            self.fields['password'].required = False
        else:
            # Criação: senha é obrigatória
            self.fields['password'].required = True

    @staticmethod
    def validate_foto(self, value):
        max_size = 2 * 1024 * 1024  # 2MB
        if value.size > max_size:
            raise serializers.ValidationError(
                "A imagem não pode ser maior que 2MB."
            )
        return value
