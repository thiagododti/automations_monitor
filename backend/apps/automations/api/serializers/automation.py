from rest_framework import serializers
from apps.automations.models import Automation
from apps.departments.models import Department
from apps.users.models import User



class UserSerializerAutomations(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "first_name",
            "last_name",

        ]

class DepartmentSerializerAutomations(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = [
            "name",
        ]

class AutomationSerializer(serializers.ModelSerializer):
    updated_by_data = UserSerializerAutomations(source='updated_by', read_only=True)
    department_data = DepartmentSerializerAutomations(source='department', read_only=True)

    class Meta:
        model = Automation
        fields = [
            'id',
            'name',
            'description',
            'is_active',
            'created_at',
            'updated_at',
            'updated_by',
            'updated_by_data',
            'department',
            'department_data',
            'manual_time',

        ]
        read_only_fields = [
            'created_at',
            'updated_at',
            'updated_by',
            'updated_by_data',
            'department_data'
        ]
