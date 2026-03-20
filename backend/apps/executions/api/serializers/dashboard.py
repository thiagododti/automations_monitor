from rest_framework import serializers


class KPISerializer(serializers.Serializer):
    total_executions = serializers.IntegerField()
    total_time_economy_seconds = serializers.IntegerField()
    total_cost_economy = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_potential_cost = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_potential_time_seconds = serializers.IntegerField()
    avg_efficiency_percent = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_errors = serializers.IntegerField()
    total_success = serializers.IntegerField()


class KPIByAutomationSerializer(serializers.Serializer):
    automation_id = serializers.IntegerField()
    automation_name = serializers.CharField()
    total_executions = serializers.IntegerField()
    avg_efficiency_percent = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_cost_economy = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_potential_cost = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_time_economy_seconds = serializers.IntegerField()
    total_errors = serializers.IntegerField()


class EvolutionSerializer(serializers.Serializer):
    period = serializers.CharField()
    total_executions = serializers.IntegerField()
    total_time_economy_seconds = serializers.IntegerField()
    total_cost_economy = serializers.DecimalField(max_digits=10, decimal_places=2)
    avg_efficiency_percent = serializers.DecimalField(max_digits=10, decimal_places=2)