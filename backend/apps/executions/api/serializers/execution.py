from rest_framework import serializers
from apps.executions.models import Execution
from apps.automations.models import Automation
from apps.executions.constants import ExecutionStatus
from django.utils import timezone


class AutomationExecutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Automation
        fields = [
            "name",
            "description",
            "is_active"
        ]


class ExecutionSerializer(serializers.ModelSerializer):
    automation_data = AutomationExecutionSerializer(
        read_only=True, source="automation")

    class Meta:
        model = Execution
        fields = [
            'id',
            "date_start",
            "date_end",
            "status",
            "automation",
            "automation_data"
        ]
        read_only_fields = [
            "date_start",
            "automation_data",
            "date_end"
        ]

    def update(self, instance, validated_data):
        status = validated_data.get('status', instance.status)

        if status == ExecutionStatus.CONCLUIDO and instance.date_end is None:
            instance.date_end = timezone.now()

        instance.status = status
        return super().update(instance, validated_data)
