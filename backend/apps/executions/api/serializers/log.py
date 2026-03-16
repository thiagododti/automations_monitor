from rest_framework import serializers
from apps.executions.models import Log,Execution


class ExecutionLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Execution
        fields = [
            "status",
            "date_start",
            "date_end",
        ]


class LogSerializer(serializers.ModelSerializer):
    execution_data = ExecutionLogSerializer(read_only=True,source="execution")
    class Meta:
        model = Log
        fields = [
            'id',
            "description",
            "created_at",
            "updated_at",
            "execution",
            "execution_data"
        ]
        read_only_fields = [
            "created_at",
            "updated_at",
            "execution_data"
        ]