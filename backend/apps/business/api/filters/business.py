import django_filters
from apps.business.models import Business


class BusinessFilter(django_filters.FilterSet):

    name = django_filters.CharFilter(field_name="name", lookup_expr="icontains")
    description = django_filters.CharFilter(field_name="description", lookup_expr="icontains")
    cnpj = django_filters.CharFilter(field_name="cnpj", lookup_expr="icontains")
    class Meta:
        model = Business
        fields = ['id', 'name', 'description', 'cnpj']
