#!/usr/bin/env python3
import os
import sys
import django

# Configurar Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.products.models import Product, ProductImage
from apps.products.serializers import ProductListSerializer
from django.test import RequestFactory

def debug_product_images():
    """Debug de imágenes de productos"""
    print("DIAGNOSTICO DE IMAGENES DE PRODUCTOS")
    print("=" * 50)
    
    # 1. Verificar productos en BD
    products = Product.objects.filter(is_active=True)
    print(f"Productos activos en BD: {products.count()}")
    
    if products.count() == 0:
        print("No hay productos activos en la base de datos")
        return
    
    # 2. Verificar imágenes en BD
    product_images = ProductImage.objects.filter(product__is_active=True)
    print(f"Imagenes en BD: {product_images.count()}")
    
    # 3. Ver productos con y sin imágenes
    products_with_images = products.filter(images__isnull=False).distinct()
    products_without_images = products.filter(images__isnull=True)
    
    print(f"Productos con imagenes: {products_with_images.count()}")
    print(f"Productos sin imagenes: {products_without_images.count()}")
    
    # 4. Crear mock request para serializer
    factory = RequestFactory()
    request = factory.get('/')
    
    # 5. Probar serializer con productos
    print(f"\nPROBANDO SERIALIZER")
    print("-" * 30)
    
    for i, product in enumerate(products[:3]):  # Solo los primeros 3
        print(f"\n{i+1}. Producto: {product.name}")
        
        # Verificar imágenes relacionadas
        images = product.images.all()
        print(f"   Imagenes en BD: {images.count()}")
        
        for j, img in enumerate(images):
            print(f"   - Imagen {j+1}: {img.image.name}")
            print(f"   - Es primaria: {img.is_primary}")
            print(f"   - Archivo existe: {os.path.exists(img.image.path) if img.image else 'N/A'}")
        
        # Probar serializer
        serializer = ProductListSerializer(product, context={'request': request})
        data = serializer.data
        
        print(f"   primary_image en serializer: {data.get('primary_image', 'NO FIELD')}")
        
        if data.get('primary_image'):
            print(f"   URL generada: {data['primary_image']}")
        else:
            print(f"   NO HAY primary_image")
        
        print("   " + "-" * 25)
    
    # 6. Probar con múltiples productos
    print(f"\nPROBANDO SERIALIZER CON MULTIPLES PRODUCTOS")
    print("-" * 45)
    
    serializer = ProductListSerializer(products[:5], many=True, context={'request': request})
    
    print("Datos del serializer:")
    for i, product_data in enumerate(serializer.data):
        print(f"  {i+1}. {product_data['name']}")
        print(f"     primary_image: {product_data.get('primary_image', 'NO FIELD')}")
    
    # 7. Verificar URLs absolutas
    print(f"\nVERIFICANDO URLs ABSOLUTAS")
    print("-" * 30)
    
    if products_with_images.exists():
        sample_product = products_with_images.first()
        sample_image = sample_product.images.filter(is_primary=True).first() or sample_product.images.first()
        
        if sample_image and sample_image.image:
            # URL relativa
            relative_url = sample_image.image.url
            print(f"URL relativa: {relative_url}")
            
            # URL absoluta simulada
            from django.urls import reverse
            from django.conf import settings
            
            if settings.DEBUG:
                # En desarrollo, construir URL manualmente
                absolute_url = f"http://localhost:8000{relative_url}"
                print(f"URL absoluta (desarrollo): {absolute_url}")
            else:
                # En producción, usar build_absolute_uri
                from django.http import HttpRequest
                request_obj = HttpRequest()
                request_obj.META['SERVER_NAME'] = 'yourdomain.com'
                request_obj.META['SERVER_PORT'] = '443'
                request_obj.scheme = 'https'
                absolute_url = sample_image.image.url
                if not absolute_url.startswith('http'):
                    absolute_url = f"https://yourdomain.com{absolute_url}"
                print(f"URL absoluta (produccion): {absolute_url}")

if __name__ == "__main__":
    debug_product_images()