import django_filters
from apps.executions.models import Step

class StepFilterSet(django_filters.FilterSet):
    execution = django_filters.CharFilter(field_name="execution", lookup_expr="icontains")
    identification = django_filters.CharFilter(field_name="identification", lookup_expr="icontains")
    status = django_filters.CharFilter(field_name="status", lookup_expr="icontains")
    date_start = django_filters.DateFilter(field_name="date_start", lookup_expr="icontains")

    class Meta:
        model = Step
        fields = ["execution", "identification", "status", "date_start"]