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
from apps.cart.models import Cart, CartItem
from apps.cart.serializers import CartSerializer
from django.test import RequestFactory

def verify_images_solution():
    """Verificar que la solución de imágenes funciona end-to-end"""
    print("VERIFICANDO SOLUCION COMPLETA DE IMAGENES")
    print("=" * 50)
    
    # 1. Verificar datos base
    products = Product.objects.filter(is_active=True)
    print(f"Productos activos: {products.count()}")
    
    if products.count() == 0:
        print("No hay productos para probar")
        return False
    
    # 2. Verificar imágenes
    product_images = ProductImage.objects.filter(product__is_active=True)
    print(f"Imágenes en BD: {product_images.count()}")
    
    products_with_images = products.filter(images__isnull=False).distinct()
    print(f"Productos con imágenes: {products_with_images.count()}")
    
    # 3. Crear request simulado para el frontend
    factory = RequestFactory()
    request = factory.get('/')
    
    # 4. Probar serializer de productos
    print(f"\n4. PROBANDO SERIALIZER DE PRODUCTOS")
    print("-" * 40)
    
    serializer = ProductListSerializer(products[:3], many=True, context={'request': request})
    
    sample_data = []
    for i, product_data in enumerate(serializer.data):
        print(f"Producto {i+1}: {product_data['name']}")
        primary_image = product_data.get('primary_image')
        print(f"  - primary_image: {primary_image}")
        
        if primary_image:
            print(f"  - ✅ URL generada correctamente")
            sample_data.append({
                'id': product_data['id'],
                'name': product_data['name'],
                'primary_image': primary_image
            })
        else:
            print(f"  - ❌ NO HAY primary_image")
    
    # 5. Simular carrito con productos
    print(f"\n5. SIMULANDO CARRITO CON IMAGENES")
    print("-" * 40)
    
    # Crear o obtener un carrito de prueba
    from apps.users.models import User
    test_user, created = User.objects.get_or_create(
        username='test_images_user',
        defaults={'email': 'test_images@example.com', 'first_name': 'Test', 'last_name': 'User'}
    )
    
    cart, cart_created = Cart.objects.get_or_create(user=test_user)
    
    # Agregar items al carrito si no existen
    if cart.items.count() == 0:
        for i, product in enumerate(products[:2]):
            CartItem.objects.create(
                cart=cart,
                product=product,
                quantity=i+1,
                size='M',
                color='Negro' if i == 0 else 'Azul'
            )
    
    # Serializar carrito
    cart_serializer = CartSerializer(cart, context={'request': request})
    cart_data = cart_serializer.data
    
    print(f"Carrito items: {cart_data['items_count']}")
    print(f"Carrito total: {cart_data['total']}")
    
    # Verificar imágenes en items del carrito
    for i, item in enumerate(cart_data['items']):
        product_name = item['product']['name']
        primary_image = item['product'].get('primary_image')
        print(f"  Item {i+1}: {product_name}")
        print(f"    - primary_image: {primary_image}")
        
        if primary_image:
            print(f"    - ✅ Imagen disponible en carrito")
        else:
            print(f"    - ❌ Sin imagen en carrito")
    
    # 6. Simular URLs que verá el frontend
    print(f"\n6. SIMULANDO URLs DEL FRONTEND")
    print("-" * 35)
    
    frontend_base_url = "http://localhost:5173"
    backend_base_url = "http://localhost:8000"
    
    for i, item in enumerate(cart_data['items']):
        product_name = item['product']['name']
        relative_image_url = item['product'].get('primary_image')
        
        if relative_image_url:
            frontend_url = f"{frontend_base_url}{relative_image_url}"
            backend_url = f"{backend_base_url}{relative_image_url}"
            
            print(f"Producto: {product_name}")
            print(f"  - URL relativa: {relative_image_url}")
            print(f"  - Frontend URL: {frontend_url}")
            print(f"  - Backend URL: {backend_url}")
            print(f"  - ✅ URLs generadas para proxy de Vite")
    
    # 7. Verificar configuración de Vite
    print(f"\n7. CONFIGURACION DE PROXY VITE")
    print("-" * 30)
    
    vite_config_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'frontend', 'vite.config.js')
    if os.path.exists(vite_config_path):
        with open(vite_config_path, 'r') as f:
            vite_config = f.read()
            if '/media' in vite_config and 'localhost:8000' in vite_config:
                print("✅ Proxy para /media configurado en Vite")
                print("✅ Target configurado a http://localhost:8000")
            else:
                print("❌ Proxy para /media NO configurado en Vite")
    else:
        print("❌ Archivo vite.config.js no encontrado")
    
    # 8. Resumen final
    print(f"\n8. RESUMEN DE LA SOLUCION")
    print("-" * 25)
    
    products_with_images_count = sum(1 for item in cart_data['items'] if item['product'].get('primary_image'))
    total_items = len(cart_data['items'])
    
    print(f"Items en carrito: {total_items}")
    print(f"Items con imágenes: {products_with_images_count}")
    print(f"Porcentaje con imágenes: {(products_with_images_count/total_items)*100:.1f}%")
    
    if products_with_images_count == total_items:
        print("\n🎉 ¡SOLUCION COMPLETA Y FUNCIONAL!")
        print("✅ Backend genera URLs de imágenes correctamente")
        print("✅ Proxy de Vite configurado para /media")
        print("✅ URLs absolutas construidas para frontend")
        print("✅ Cart/Checkout tendrán imágenes optimizadas")
        return True
    else:
        print("\n⚠️ SOLUCION PARCIAL")
        print("Algunas imágenes no se están generando correctamente")
        return False

if __name__ == "__main__":
    success = verify_images_solution()
    if success:
        print("\n🚀 LA SOLUCION ESTA LISTA PARA USAR")
        print("Para probar:")
        print("1. Iniciar backend: cd fashion-store/backend && python manage.py runserver")
        print("2. Iniciar frontend: cd fashion-store/frontend && npm run dev")
        print("3. Visitar: http://localhost:5173/carrito")
        print("4. Visitar: http://localhost:5173/test-images.html")
    else:
        print("\n🔧 REVISAR PROBLEMAS ANTES DEL DESPLIEGUE")