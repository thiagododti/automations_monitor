import django_filters
from apps.executions.models import Step


class StepFilter(django_filters.FilterSet):
    date_start = django_filters.DateFilter(field_name="date_start__date")
    class Meta:
        model = Step
        fields = ["execution", "identification", "status", "date_start"]
