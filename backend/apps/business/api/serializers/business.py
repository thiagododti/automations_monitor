from rest_framework import serializers
from apps.business.models import Business
from utils.svgimgfield import SVGAndImageField


class BusinessSerializer(serializers.ModelSerializer):
    logo = SVGAndImageField(required=False, allow_null=True)

    class Meta:
        model = Business
        fields = [
            'id',
            'name',
            'description',
            'cnpj',
            'created_at',
            'updated_at',
            'logo',
            'certificado',
            'certificate_expire',
            'subject_cn',
            'subject_c',
            'subject_o',
            'issuer_cn',
            'issuer_c',
            'issuer_o'

        ]
        read_only_fields = [
            'created_at',
            'updated_at',
            'updated_by',
        ]

class BusinessOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Business
        fields = ['id', 'name']
