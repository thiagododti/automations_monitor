from rest_framework import serializers

from apps.business.models import Business
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

class BusinessExecutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Business
        fields = [
            "name",
            "cnpj",
            "logo"
        ]


class ExecutionSerializer(serializers.ModelSerializer):
    automation_data = AutomationExecutionSerializer(
        read_only=True, source="automation")
    business_data = BusinessExecutionSerializer(read_only=True, source="business")

    class Meta:
        model = Execution
        fields = [
            'id',
            "date_start",
            "date_end",
            "status",
            "automation",
            "automation_data",
            "business",
            "business_data",
            "step_counts",
            "success_count",
            "error_count",
            "time_automation_seconds",
            "time_manual_seconds",
            "time_economy_seconds",
            "cost_economy",
            "potential_time_seconds",
            "potential_cost",
            "efficiency_percent"

        ]
        read_only_fields = [
            "date_start",
            "automation_data",
            "date_end",
            "step_counts",
            "success_count",
            "error_count",
            "business_data",
            "time_automation_seconds",
            "time_manual_seconds",
            "time_economy_seconds",
            "cost_economy",
            "potential_time_seconds",
            "potential_cost",
            "efficiency_percent"
        ]

    def update(self, instance, validated_data):
        status = validated_data.get('status', instance.status)

        if status in [ExecutionStatus.CONCLUIDO, ExecutionStatus.ERRO, ExecutionStatus.ALERTA] and instance.date_end is None:
            instance.date_end = timezone.now()

        instance.status = status
        return super().update(instance, validated_data)
