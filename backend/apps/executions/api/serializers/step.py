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
            "time_execution",
            "execution",
            "execution_data"

        ]
        read_only_fields = [
            "date_start",
            "date_end",  # verificar se vai manter read_only ou automatizar
            "time_execution",
            "execution_data"
        ]

    def update(self, instance, validated_data):
        status = validated_data.get('status', instance.status)

        if status in ExecutionStatus.CONCLUIDO and instance.date_end is None:
            instance.date_end = timezone.now()

        instance.status = status
        return super().update(instance, validated_data)
