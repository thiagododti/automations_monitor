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
            "automation_data",
            "step_counts",
            "success_count",
            "error_count",
            "time_automation_seconds",
            "time_manual_seconds",
            "time_economy_seconds",
            "cost_economy"
        ]
        read_only_fields = [
            "date_start",
            "automation_data",
            "date_end",
            "step_counts",
            "success_count",
            "error_count",
            "time_automation_seconds",
            "time_manual_seconds",
            "time_economy_seconds",
            "cost_economy"
        ]

    def update(self, instance, validated_data):
        status = validated_data.get('status', instance.status)

        if status in [ExecutionStatus.CONCLUIDO, ExecutionStatus.ERRO, ExecutionStatus.ALERTA] and instance.date_end is None:
            instance.date_end = timezone.now()

        instance.status = status
        return super().update(instance, validated_data)
