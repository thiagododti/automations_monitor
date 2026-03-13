import django_filters
from apps.automations.models import Automation

class AutomationFilterSet(django_filters.FilterSet):
    name = django_filters.CharFilter(field_name='name', lookup_expr='icontains')
    is_active = django_filters.BooleanFilter(field_name='is_active', lookup_expr='isnull')


    class Meta:
        model = Automation
        fields = ['name', 'is_active']
