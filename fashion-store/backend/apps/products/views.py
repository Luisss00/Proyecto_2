from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.db.models import Q, Avg
from .models import Category, Product, Review
from .serializers import (
    CategorySerializer, ProductListSerializer, 
    ProductDetailSerializer, ProductCreateUpdateSerializer,
    ReviewSerializer
)
from apps.users.permissions import IsVendedorOrAdmin, IsOwnerOrAdmin

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsVendedorOrAdmin()]

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(is_active=True)
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'created_at', 'views_count']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ProductListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return ProductCreateUpdateSerializer
        return ProductDetailSerializer
    
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
        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def featured(self, request):
        featured_products = self.queryset.filter(is_featured=True)[:8]
        serializer = ProductListSerializer(featured_products, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def offers(self, request):
        offers = self.queryset.exclude(discount_price__isnull=True)[:12]
        serializer = ProductListSerializer(offers, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def add_review(self, request, pk=None):
        product = self.get_object()
        serializer = ReviewSerializer(data=request.data)
        
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
            
            serializer.save(user=request.user, product=product)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def my_products(self, request):
        if request.user.role != 'vendedor':
            return Response({'error': 'Solo vendedores pueden acceder'}, status=status.HTTP_403_FORBIDDEN)
        
        products = Product.objects.filter(vendor=request.user)
        serializer = ProductListSerializer(products, many=True, context={'request': request})
        return Response(serializer.data)