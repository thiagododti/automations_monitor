import django_filters
from apps.positions.models import Position

class PositionFilter(django_filters.FilterSet):
    class Meta:
        model = Position
        fields = [
            'name',
            'nivel',
        ]