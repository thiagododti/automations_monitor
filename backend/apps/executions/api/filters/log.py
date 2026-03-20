import django_filters
from apps.executions.models import Log


class LogFilter(django_filters.FilterSet):
    execution = django_filters.CharFilter(
        field_name="execution", lookup_expr="exact")
    description = django_filters.CharFilter(
        field_name="description", lookup_expr="icontains")
    created_at = django_filters.DateFilter(
        field_name="created_at", lookup_expr="icontains")

    class Meta:
        model = Log
        fields = ["execution", "description", "created_at"]
