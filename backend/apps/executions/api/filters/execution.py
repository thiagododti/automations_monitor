import django_filters
from apps.executions.models import Execution

class ExecutionFilter(django_filters.FilterSet):
    class Meta:
        model = Execution
        fields = ["automation", "date_start", "status"]