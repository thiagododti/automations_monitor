import django_filters
from apps.executions.models import Execution


class ExecutionFilter(django_filters.FilterSet):
    automation = django_filters.CharFilter(
        field_name="automation__name",
        lookup_expr="icontains"
    )

    date_start = django_filters.DateFilter(field_name="date_start__date")

    class Meta:
        model = Execution
        fields = ["automation", "date_start", "status", "business"]

