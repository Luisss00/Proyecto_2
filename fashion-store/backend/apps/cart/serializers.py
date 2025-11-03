from rest_framework import serializers
from .models import Cart, CartItem
from apps.products.serializers import ProductListSerializer

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'quantity', 'size', 
                  'color', 'subtotal', 'created_at']
        read_only_fields = ['id', 'subtotal', 'created_at']

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Cart
        fields = ['id', 'items', 'total', 'items_count', 'created_at']
        read_only_fields = ['id', 'total', 'items_count', 'created_at']