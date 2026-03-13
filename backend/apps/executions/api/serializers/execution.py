from rest_framework import serializers
from apps.executions.models import Execution

class ExecutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Execution
        fields = [
            "automation_id",
            "date_start",
            "date_end",
            "status"
        ]
        read_only_fields = [
            "date_start"
        ]