from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Count
from django.db.models.functions import TruncDate
from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderCreateSerializer
from apps.users.permissions import IsAdministrador

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'administrador':
            return Order.objects.all()
        elif user.role == 'vendedor':
            return Order.objects.filter(items__product__vendor=user).distinct()
        return Order.objects.filter(user=user)
    
    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        return OrderSerializer
    
    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        order = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in dict(Order.STATUS_CHOICES):
            return Response({'error': 'Estado inválido'}, status=status.HTTP_400_BAD_REQUEST)
        
        if request.user.role != 'administrador':
            return Response({'error': 'No tienes permisos'}, status=status.HTTP_403_FORBIDDEN)
        
        order.status = new_status
        order.save()
        
        serializer = self.get_serializer(order)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def process_payment(self, request, pk=None):
        order = self.get_object()
        payment_method = order.payment_method
        
        if payment_method == 'contra_entrega':
            order.status = 'confirmado'
            order.save()
            return Response(OrderSerializer(order).data)
        
        return Response({'error': 'Método de pago no soportado'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAdministrador])
    def statistics(self, request):
        from datetime import timedelta
        from django.utils import timezone
        
        total_orders = Order.objects.count()
        total_revenue = Order.objects.filter(is_paid=True).aggregate(Sum('total'))['total__sum'] or 0
        pending_orders = Order.objects.filter(status='pendiente').count()
        
        seven_days_ago = timezone.now() - timedelta(days=7)
        orders_by_day = Order.objects.filter(
            created_at__gte=seven_days_ago
        ).annotate(
            date=TruncDate('created_at')
        ).values('date').annotate(
            count=Count('id'),
            revenue=Sum('total')
        ).order_by('date')
        
        top_products = OrderItem.objects.values(
            'product__name'
        ).annotate(
            total_sold=Sum('quantity')
        ).order_by('-total_sold')[:5]
        
        return Response({
            'total_orders': total_orders,
            'total_revenue': float(total_revenue),
            'pending_orders': pending_orders,
            'orders_by_day': list(orders_by_day),
            'top_products': list(top_products),
        })