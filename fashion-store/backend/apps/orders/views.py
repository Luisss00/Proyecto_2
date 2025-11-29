from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q, Sum, Count
from .models import Order, OrderItem
from .serializers import (
    OrderSerializer, 
    OrderDetailSerializer, 
    OrderCreateSerializer
)


class OrderViewSet(viewsets.ModelViewSet):
    """ViewSet para gestión de órdenes"""
    queryset = Order.objects.all().select_related('user').prefetch_related('items__product')
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        elif self.action == 'retrieve':
            return OrderDetailSerializer
        return OrderSerializer
    
    def get_queryset(self):
        user = self.request.user
        
        if user.role == 'administrador':
            return Order.objects.all()
        else:
            # Cliente solo ve sus propios pedidos
            return Order.objects.filter(user=user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        order = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in dict(Order.STATUS_CHOICES):
            return Response(
                {'error': 'Estado inválido'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        order.status = new_status
        order.save()
        
        serializer = self.get_serializer(order)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_orders(self, request):
        """Obtener órdenes del usuario actual (cliente)"""
        user_orders = Order.objects.filter(user=request.user).select_related('user').prefetch_related('items__product')
        serializer = OrderSerializer(user_orders, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def statistics(self, request):
        """Estadísticas generales de pedidos (solo admin)"""
        if request.user.role != 'administrador':
            return Response(
                {'error': 'Solo administradores pueden acceder'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        stats = Order.objects.aggregate(
            total_orders=Count('id'),
            total_revenue=Sum('total'),
            pending=Count('id', filter=Q(status='pendiente')),
            confirmed=Count('id', filter=Q(status='confirmado')),
            delivered=Count('id', filter=Q(status='entregado')),
        )
        
        # Top productos vendidos
        top_products = OrderItem.objects.filter(
            order__status='entregado'
        ).values(
            'product__name'
        ).annotate(
            total_sold=Sum('quantity')
        ).order_by('-total_sold')[:5]
        
        # Ventas por día (últimos 7 días)
        from datetime import datetime, timedelta
        from django.db.models.functions import TruncDate
        
        seven_days_ago = datetime.now() - timedelta(days=7)
        orders_by_day = Order.objects.filter(
            created_at__gte=seven_days_ago
        ).annotate(
            date=TruncDate('created_at')
        ).values('date').annotate(
            revenue=Sum('total'),
            count=Count('id')
        ).order_by('date')
        
        return Response({
            **stats,
            'top_products': list(top_products),
            'orders_by_day': list(orders_by_day),
        })
    
    