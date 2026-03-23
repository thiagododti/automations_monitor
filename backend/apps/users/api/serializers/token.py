from rest_framework import serializers
from rest_framework.authtoken.models import Token


class TokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Token
        fields = ["key", "user", "created"]
        read_only_fields = ["key", "created"]


class RegenerateTokenSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
