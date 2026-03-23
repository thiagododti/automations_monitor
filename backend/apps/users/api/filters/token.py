import django_filters
from rest_framework.authtoken.models import Token


class TokenFilter(django_filters.FilterSet):
    class Meta:
        model = Token
        fields = '__all__'
