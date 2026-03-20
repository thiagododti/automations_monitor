import django_filters
from apps.departments.models import Department

class DepartmentFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(
        field_name='name', lookup_expr='icontains', label='Departamento')
    description = django_filters.CharFilter(
        field_name='description', lookup_expr='icontains', label='Descrição')

    class Meta:
        model = Department
        fields = ['name', 'description']