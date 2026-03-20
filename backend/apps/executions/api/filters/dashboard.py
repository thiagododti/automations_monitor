import django_filters
from apps.executions.models import Execution


class DashboardFilter(django_filters.FilterSet):
    date_from = django_filters.DateTimeFilter(field_name="date_start", lookup_expr="gte")
    date_to = django_filters.DateTimeFilter(field_name="date_start", lookup_expr="lte")

    class Meta:
        model = Execution
        fields = ["business", "automation", "status", "date_from", "date_to"]