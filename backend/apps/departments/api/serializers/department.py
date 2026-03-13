from rest_framework import serializers
from apps.departments.models import Department

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = [
            'name',
            'description',
            'status',
            'created_at',
            'updated_at',
            'updated_by'
        ]
        read_only_fields = [
            'created_at',
            'updated_at',
            'updated_by'
        ]