import django_filters
from apps.executions.models import Step


class StepFilter(django_filters.FilterSet):
    class Meta:
        model = Step
        fields = ["execution", "identification", "status", "date_start"]
