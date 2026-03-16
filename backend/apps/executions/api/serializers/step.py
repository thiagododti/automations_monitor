from rest_framework import serializers
from apps.executions.models import Step

class StepSerializer(serializers.ModelSerializer):
    class Meta:
        model = Step
        fields = [
            "execution_id",
            "identification",
            "status",
            "date_start",
            "date_end",
            "time_execution"
        ]
        read_only_fields = [
            "date_start",
            "date_end", # verificar se vai manter read_only ou automatizar
            "time_execution"
        ]