from rest_framework import serializers
from apps.users.models import User
from apps.departments.models import Department
from django.contrib.auth.password_validation import validate_password


class DepartmentUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = [
            "name",
            "description",
            "status"
        ]


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'first_name',
            'last_name',
        ]


class UserReadSerializer(serializers.ModelSerializer):

    department_data = DepartmentUserSerializer(
        read_only=True, source="department")
    updated_by_data = UserUpdateSerializer(
        read_only=True, source="updated_by")

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
            'photo',
            'updated_by',
            "department",
            "department_data",
            "updated_by_data",
        ]
        read_only_fields = [
            "department_data",
            "date_joined",
            "updated_by",
            "updated_by_data",
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

    def validate_password(self, value):
        validate_password(value, self.instance)
        return value

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance:
            # Atualização: senha não é obrigatória
            self.fields['password'].required = False
        else:
            # Criação: senha é obrigatória
            self.fields['password'].required = True

    def create(self, validated_data):
        password = validated_data.pop('password')
        return User.objects.create_user(password=password, **validated_data)

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)

        instance.save()
        return instance

    @staticmethod
    def validate_foto(self, value):
        max_size = 2 * 1024 * 1024  # 2MB
        if value.size > max_size:
            raise serializers.ValidationError(
                "A imagem não pode ser maior que 2MB."
            )
        return value
