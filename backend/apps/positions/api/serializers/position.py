from rest_framework import serializers
from apps.positions.models import Position

class PositionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Position
        fields = [
            'id',
            'name',
            'description',
            'nivel',
            'cost_hour'
        ]



class PositionOptionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Position
        fields = [
            'id',
            'name',
        ]