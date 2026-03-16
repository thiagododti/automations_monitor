from rest_framework import serializers
from apps.departments.models import Department
from apps.users.models import User


class UserDepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "first_name",
            "last_name",
        ]


class DepartmentSerializer(serializers.ModelSerializer):
    updated_by_data = UserDepartmentSerializer(
        read_only=True, source='updated_by')

    class Meta:
        model = Department
        fields = [
            'id',
            'name',
            'description',
            'status',
            'created_at',
            'updated_at',
            'updated_by',
            'updated_by_data'

        ]
        read_only_fields = [
            'created_at',
            'updated_at',
            'updated_by',
            'updated_by_data'
        ]
