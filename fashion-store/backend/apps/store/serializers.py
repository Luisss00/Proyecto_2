from rest_framework import serializers
from .models import StoreConfiguration

class StoreConfigurationSerializer(serializers.ModelSerializer):
    """
    Serializer para la configuración de la tienda
    """
    class Meta:
        model = StoreConfiguration
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')