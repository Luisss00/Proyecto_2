from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.db.models import Q, Avg, Sum, Count
from django.db.models.functions import TruncMonth
from datetime import datetime, timedelta
from .models import Category, Product, Review
from .serializers import (
    CategorySerializer, ProductListSerializer,
    ProductDetailSerializer, ProductCreateUpdateSerializer,
    ReviewSerializer
)
from apps.users.permissions import IsVendedorOrAdmin, IsOwnerOrAdmin


class CategoryViewSet(viewsets.ModelViewSet):
    """ViewSet para gestionar categorías"""
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsVendedorOrAdmin()]


class ProductViewSet(viewsets.ModelViewSet):
    """ViewSet para gestionar productos"""
    queryset = Product.objects.filter(is_active=True).select_related(
        'category', 'vendor'
    ).prefetch_related('images', 'reviews')
    
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'created_at', 'views_count']
    ordering = ['-created_at']
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductDetailSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return ProductCreateUpdateSerializer
        return ProductListSerializer
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'featured', 'offers']:
            return [AllowAny()]
        elif self.action in ['create']:
            return [IsVendedorOrAdmin()]
        elif self.action in ['update', 'partial_update', 'destroy']:
            return [IsOwnerOrAdmin()]
        return [IsAuthenticated()]
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.views_count += 1
        instance.save(update_fields=['views_count'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def featured(self, request):
        featured_products = self.get_queryset().filter(is_featured=True)[:8]
        serializer = ProductListSerializer(
            featured_products, 
            many=True, 
            context={'request': request}
        )
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def offers(self, request):
        offers = self.get_queryset().exclude(discount_price__isnull=True)[:12]
        serializer = ProductListSerializer(
            offers, 
            many=True, 
            context={'request': request}
        )
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def latest(self, request):
        latest = self.get_queryset().order_by('-created_at')[:8]
        serializer = ProductListSerializer(
            latest, 
            many=True, 
            context={'request': request}
        )
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def add_review(self, request, pk=None):
        product = self.get_object()
        serializer = ReviewSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            has_purchased = request.user.orders.filter(
                items__product=product,
                status='entregado'
            ).exists()
            
            if not has_purchased:
                return Response(
                    {'error': 'Debes haber comprado este producto para dejar una reseña'},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            existing_review = Review.objects.filter(
                user=request.user,
                product=product
            ).first()
            
            if existing_review:
                return Response(
                    {'error': 'Ya has dejado una reseña para este producto'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            serializer.save(user=request.user, product=product)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_products(self, request):
        """Productos del vendedor actual"""
        if request.user.role not in ['vendedor', 'administrador']:
            return Response(
                {'error': 'Solo vendedores pueden acceder'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        products = Product.objects.filter(vendor=request.user).select_related(
            'category'
        ).prefetch_related('images')
        
        serializer = ProductListSerializer(
            products, 
            many=True, 
            context={'request': request}
        )
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def vendor_statistics(self, request):
        """Estadísticas del vendedor"""
        if request.user.role not in ['vendedor', 'administrador']:
            return Response(
                {'error': 'Solo vendedores pueden acceder'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        from apps.orders.models import OrderItem
        
        # Productos del vendedor
        vendor_products = Product.objects.filter(vendor=request.user)
        
        # Estadísticas generales
        total_products = vendor_products.count()
        active_products = vendor_products.filter(is_active=True).count()
        
        # Ventas totales
        total_sales = OrderItem.objects.filter(
            product__vendor=request.user,
            order__status='entregado'
        ).aggregate(
            total=Sum('price'),
            count=Count('id')
        )
        
        # Productos más vendidos
        top_products = OrderItem.objects.filter(
            product__vendor=request.user,
            order__status='entregado'
        ).values(
            'product__id',
            'product__name'
        ).annotate(
            total_sold=Sum('quantity'),
            revenue=Sum('price')
        ).order_by('-total_sold')[:5]
        
        # Ventas por mes (últimos 6 meses)
        six_months_ago = datetime.now() - timedelta(days=180)
        monthly_sales = OrderItem.objects.filter(
            product__vendor=request.user,
            order__status='entregado',
            order__created_at__gte=six_months_ago
        ).annotate(
            month=TruncMonth('order__created_at')
        ).values('month').annotate(
            revenue=Sum('price'),
            orders=Count('order', distinct=True)
        ).order_by('month')
        
        # Stock bajo
        low_stock = vendor_products.filter(stock__lte=5, stock__gt=0).count()
        out_of_stock = vendor_products.filter(stock=0).count()
        
        return Response({
            'total_products': total_products,
            'active_products': active_products,
            'total_revenue': total_sales['total'] or 0,
            'total_orders': total_sales['count'] or 0,
            'top_products': list(top_products),
            'monthly_sales': list(monthly_sales),
            'low_stock_count': low_stock,
            'out_of_stock_count': out_of_stock,
        })
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def low_stock(self, request):
        """Productos con stock bajo"""
        if request.user.role not in ['vendedor', 'administrador']:
            return Response(
                {'error': 'Solo vendedores pueden acceder'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        low_stock_products = Product.objects.filter(
            vendor=request.user,
            stock__lte=5,
            is_active=True
        ).select_related('category').prefetch_related('images')
        
        serializer = ProductListSerializer(
            low_stock_products,
            many=True,
            context={'request': request}
        )
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def by_category(self, request):
        category_id = request.query_params.get('category')
        if not category_id:
            return Response(
                {'error': 'Parámetro category requerido'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        products = self.get_queryset().filter(category_id=category_id)
        serializer = ProductListSerializer(
            products, 
            many=True, 
            context={'request': request}
        )
        return Response(serializer.data)


class ReviewViewSet(viewsets.ModelViewSet):
    """ViewSet para gestionar reseñas"""
    queryset = Review.objects.all().select_related('user', 'product')
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        product_id = self.request.query_params.get('product')
        if product_id:
            queryset = queryset.filter(product_id=product_id)
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)