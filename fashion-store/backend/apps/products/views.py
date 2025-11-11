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
from apps.users.permissions import IsAdministrador, IsOwnerOrAdmin


class CategoryViewSet(viewsets.ModelViewSet):
    """ViewSet para gestionar categorías"""
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAdministrador()]


class ProductViewSet(viewsets.ModelViewSet):
    """ViewSet para gestionar productos"""
    queryset = Product.objects.all().select_related(
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
        if self.action in ['list', 'retrieve', 'featured', 'offers', 'latest', 'by_category']:
            return [AllowAny()]
        elif self.action in ['create']:
            return [IsAdministrador()]
        elif self.action in ['update', 'partial_update', 'destroy', 'add_review']:
            return [IsAuthenticated()]
        return [IsAdministrador()]
    
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
    
    @action(detail=False, methods=['get'], permission_classes=[IsAdministrador])
    def all_for_admin(self, request):
        """Todos los productos para administradores"""
        products = Product.objects.all().select_related(
            'category', 'vendor'
        ).prefetch_related('images')
        
        serializer = ProductListSerializer(
            products,
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