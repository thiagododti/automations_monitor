import django_filters
from apps.executions.models import Execution
from datetime import datetime, time


class DashboardFilter(django_filters.FilterSet):
    date_from = django_filters.DateFilter(method="filter_date_from")
    date_to = django_filters.DateFilter(method="filter_date_to")

    class Meta:
        model = Execution
        fields = ["business", "automation", "status", "date_from", "date_to"]

    def filter_date_from(self, queryset, name, value):
        date_start = datetime.combine(value, time.min)
        return queryset.filter(date_start__gte=date_start)

    def filter_date_to(self, queryset, name, value):
        date_end = datetime.combine(value, time.max)
        return queryset.filter(date_start__lte=date_end)
