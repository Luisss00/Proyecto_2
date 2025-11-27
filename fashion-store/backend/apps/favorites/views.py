from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .models import Favorite
from .serializers import FavoriteSerializer, FavoriteCreateSerializer
from apps.products.models import Product

class FavoriteViewSet(viewsets.ModelViewSet):
    """
    ViewSet para manejar productos favoritos
    """
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Retornar favoritos del usuario actual"""
        return Favorite.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        """Retornar el serializer apropiado según la acción"""
        if self.action == 'create':
            return FavoriteCreateSerializer
        return FavoriteSerializer
    
    @action(detail=False, methods=['get'])
    def count(self, request):
        """Endpoint para obtener el número total de favoritos del usuario"""
        count = Favorite.objects.filter(user=request.user).count()
        return Response({'count': count})
    
    @action(detail=False, methods=['get'])
    def check_favorite(self, request):
        """Verificar si un producto específico está en favoritos"""
        product_id = request.query_params.get('product_id')
        if not product_id:
            return Response(
                {'error': 'product_id es requerido'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            product = Product.objects.get(id=product_id)
            is_favorite = Favorite.objects.filter(
                user=request.user, 
                product=product
            ).exists()
            
            return Response({
                'is_favorite': is_favorite,
                'product_id': int(product_id)
            })
        except Product.DoesNotExist:
            return Response(
                {'error': 'Producto no encontrado'}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['post'])
    def toggle(self, request):
        """Toggle de favorito - agregar o quitar producto de favoritos"""
        product_id = request.data.get('product_id')
        if not product_id:
            return Response(
                {'error': 'product_id es requerido'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            product = Product.objects.get(id=product_id)
            
            # Verificar si el producto ya está en favoritos
            favorite = Favorite.objects.filter(
                user=request.user, 
                product=product
            ).first()
            
            if favorite:
                # Si existe, eliminarlo (quitar de favoritos)
                favorite.delete()
                return Response({
                    'is_favorite': False,
                    'message': 'Producto eliminado de favoritos'
                })
            else:
                # Si no existe, crearlo (agregar a favoritos)
                Favorite.objects.create(user=request.user, product=product)
                return Response({
                    'is_favorite': True,
                    'message': 'Producto agregado a favoritos'
                })
                
        except Product.DoesNotExist:
            return Response(
                {'error': 'Producto no encontrado'}, 
                status=status.HTTP_404_NOT_FOUND
            )