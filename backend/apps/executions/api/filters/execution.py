import django_filters
from apps.executions.models import Execution

class ExecutionFilterSet(django_filters.rest_framework.FilterSet):
    automation = django_filters.CharFilter("automation__name", lookup_expr="icontains", label="Automação")
    date_start = django_filters.DateFilter("date_start")
    status = django_filters.CharFilter("status", lookup_expr="icontains", label="Status")

    class Meta:
        model = Execution
        fields = ["automation", "date_start", "status"]


