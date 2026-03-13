from rest_framework import serializers
from apps.automations.models import Automation


class AutomationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Automation
        fields = [
            'name',
            'description',
            'is_active',
            'created_at',
            'updated_at',
            'manual_time',
        ]
        read_only_fields = [
            'created_at',
            'updated_at',
            'updated_by',
        ]

