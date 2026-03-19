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
        ]
        read_only_fields = [
            'created_at',
            'updated_at',
            'updated_by',
        ]

    # @staticmethod
    # def validate_logo(value):
    #     max_size = 2 * 1024 * 1024  # 2MB
    #     if value.size > max_size:
    #         raise serializers.ValidationError(
    #             "A imagem não pode ser maior que 2MB."
    #         )
    #     return value


class BusinessOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Business
        fields = ['id', 'name']
