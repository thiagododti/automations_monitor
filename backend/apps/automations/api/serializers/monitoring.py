from rest_framework import serializers
from apps.automations.models import Automation


class AutomationStatusSerializer(serializers.ModelSerializer):
    last_status = serializers.CharField()
    last_date_start = serializers.DateTimeField()
    last_date_end = serializers.DateTimeField()
    last_execution_id = serializers.IntegerField()

    class Meta:
        model = Automation
        fields = [
            'id',
            'name',
            'last_status',
            'last_date_start',
            'last_date_end',
            'last_execution_id',
        ]
