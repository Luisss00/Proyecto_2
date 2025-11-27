from rest_framework import serializers
from .models import Favorite
from apps.products.serializers import ProductListSerializer

class FavoriteSerializer(serializers.ModelSerializer):
    """Serializer para los productos favoritos"""
    product = ProductListSerializer(read_only=True)
    
    class Meta:
        model = Favorite
        fields = ['id', 'user', 'product', 'created_at']
        read_only_fields = ['user', 'created_at']

class FavoriteCreateSerializer(serializers.ModelSerializer):
    """Serializer para crear nuevos favoritos"""
    
    class Meta:
        model = Favorite
        fields = ['product']
    
    def create(self, validated_data):
        user = self.context['request'].user
        product = validated_data['product']
        
        # Verificar si el producto ya está en favoritos
        if Favorite.objects.filter(user=user, product=product).exists():
            raise serializers.ValidationError("Este producto ya está en tus favoritos")
        
        return Favorite.objects.create(user=user, **validated_data)