from rest_framework import serializers
from apps.executions.models import Step, Execution
from django.utils import timezone
from apps.executions.constants import ExecutionStatus


class ExecutionStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = Execution
        fields = [
            "status",
            "date_start",
            "date_end"
        ]


class StepSerializer(serializers.ModelSerializer):
    execution_data = ExecutionStepSerializer(
        read_only=True, source='execution')

    class Meta:
        model = Step
        fields = [
            'id',
            "identification",
            "status",
            "date_start",
            "date_end",
            "time_automation_seconds",
            "time_manual_seconds",
            "time_economy_seconds",
            "potential_time_seconds",
            "potential_cost",
            "efficiency_percent",
            "execution",
            "execution_data"

        ]
        read_only_fields = [
            "date_start",
            "date_end",
            "time_automation_seconds",
            "time_manual_seconds",
            "time_economy_seconds",
            "potential_time_seconds",
            "potential_cost",
            "efficiency_percent",
            "execution_data"
        ]

    def update(self, instance, validated_data):
        status = validated_data.get('status', instance.status)

        if status in [ExecutionStatus.CONCLUIDO, ExecutionStatus.ALERTA] and instance.date_end is None:
            instance.date_end = timezone.now()

        instance.status = status
        return super().update(instance, validated_data)
