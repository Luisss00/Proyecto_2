from rest_framework import serializers
from .models import Order, OrderItem
from apps.products.serializers import ProductListSerializer
import uuid

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity', 'size', 'color', 
                  'price', 'subtotal']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Order
        fields = ['id', 'order_number', 'status', 'payment_method', 
                  'is_paid', 'shipping_address', 'shipping_city', 
                  'shipping_phone', 'shipping_cost', 'subtotal', 
                  'tax', 'total', 'items', 'notes', 'created_at']
        read_only_fields = ['id', 'order_number', 'created_at']

class OrderCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['payment_method', 'shipping_address', 'shipping_city',
                  'shipping_phone', 'notes']
    
    def create(self, validated_data):
        user = self.context['request'].user
        cart = user.cart
        
        if not cart.items.exists():
            raise serializers.ValidationError("El carrito está vacío")
        
        validated_data['order_number'] = f"ORD-{uuid.uuid4().hex[:8].upper()}"
        validated_data['user'] = user
        validated_data['subtotal'] = cart.total
        validated_data['tax'] = cart.total * 0.19
        validated_data['shipping_cost'] = 15000
        validated_data['total'] = validated_data['subtotal'] + validated_data['tax'] + validated_data['shipping_cost']
        
        order = Order.objects.create(**validated_data)
        
        for cart_item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=cart_item.product,
                quantity=cart_item.quantity,
                size=cart_item.size,
                color=cart_item.color,
                price=cart_item.product.final_price
            )
            
            cart_item.product.stock -= cart_item.quantity
            cart_item.product.save()
        
        cart.items.all().delete()
        
        return order