import django_filters
from apps.business.models import Business


class BusinessFilterSet(django_filters.FilterSet):
    id = django_filters.NumberFilter(
        field_name='id', lookup_expr='exact', label='ID'
    )
    name = django_filters.CharFilter(
        field_name='name', lookup_expr='icontains', label='Nome')
    description = django_filters.CharFilter(
        field_name='description', lookup_expr='icontains', label='Descrição')
    cnpj = django_filters.CharFilter(
        field_name='cnpj', lookup_expr='icontains', label='CNPJ'
    )

    class Meta:
        model = Business
        fields = ['id', 'name', 'description', 'cnpj']
