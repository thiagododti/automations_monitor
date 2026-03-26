import django_filters
from apps.positions.models import Position

class PositionFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(field_name="name", lookup_expr="icontains")
    description = django_filters.CharFilter(field_name="description", lookup_expr="icontains")

    class Meta:
        model = Position
        fields = [
            'name',
            'description',
            'nivel'
        ]