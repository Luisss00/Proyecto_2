from rest_framework import serializers
from .models import Order, OrderItem
from apps.products.serializers import ProductListSerializer
from apps.users.serializers import UserSerializer


class OrderItemSerializer(serializers.ModelSerializer):
    """Serializer para items de orden"""
    product = ProductListSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = OrderItem
        fields = [
            'id', 'product', 'product_id', 'quantity', 
            'size', 'color', 'price', 'subtotal'
        ]
        read_only_fields = ['id', 'price', 'subtotal']


class OrderSerializer(serializers.ModelSerializer):
    """Serializer básico para lista de órdenes"""
    user = UserSerializer(read_only=True)
    items_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'user', 'status', 'payment_method',
            'is_paid', 'total', 'items_count', 'created_at'
        ]
        read_only_fields = ['id', 'order_number', 'created_at']
    
    def get_items_count(self, obj):
        return obj.items.count()


class OrderDetailSerializer(serializers.ModelSerializer):
    """Serializer detallado para orden individual"""
    user = UserSerializer(read_only=True)
    items = OrderItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'user', 'status', 'payment_method',
            'payment_id', 'is_paid', 'shipping_address', 'shipping_city',
            'shipping_phone', 'shipping_cost', 'subtotal', 'tax', 'total',
            'notes', 'items', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'order_number', 'created_at', 'updated_at']


class OrderCreateSerializer(serializers.ModelSerializer):
    """Serializer para crear órdenes"""
    items = OrderItemSerializer(many=True)
    
    class Meta:
        model = Order
        fields = [
            'payment_method', 'shipping_address', 'shipping_city',
            'shipping_phone', 'notes', 'items'
        ]
    
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        
        # Crear la orden
        order = Order.objects.create(
            user=self.context['request'].user,
            **validated_data
        )
        
        # Crear los items de la orden
        from apps.products.models import Product
        
        for item_data in items_data:
            product = Product.objects.get(id=item_data['product_id'])
            
            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=item_data['quantity'],
                size=item_data.get('size', ''),
                color=item_data.get('color', ''),
                price=product.final_price
            )
            
            # Reducir stock
            product.stock -= item_data['quantity']
            product.save()
        
        # Calcular totales
        order.calculate_totals()
        
        return order    