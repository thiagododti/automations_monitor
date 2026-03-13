from rest_framework import serializers
from apps.executions.models import Log

class LogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Log
        fields = [
            "execution_id",
            "description",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "created_at",
            "updated_at",
        ]