from rest_framework import serializers
from apps.executions.models import Step,Execution

class ExecutionStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = Execution
        fields = [
            "status",
            "date_start",
            "date_end",
        ]

class StepSerializer(serializers.ModelSerializer):
    execution_data = ExecutionStepSerializer(read_only=True, source='execution')
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
            "date_end", # verificar se vai manter read_only ou automatizar
            "time_execution",
            "execution_data"
        ]
