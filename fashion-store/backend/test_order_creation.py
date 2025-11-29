#!/usr/bin/env python
"""Script de prueba para verificar la creación de pedidos"""

import os
import sys
import django

# Configurar Django
sys.path.append('/testbed')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.test import Client
from apps.users.models import User
import json

def test_order_creation():
    """Probar la creación de pedidos"""
    print("Iniciando prueba de creacion de pedidos...")
    
    # Crear cliente de prueba
    client = Client()
    
    # Crear usuario de prueba si no existe
    try:
        user = User.objects.get(username='testuser')
        print(f"Usuario existente: {user.username}")
    except User.DoesNotExist:
        user = User.objects.create_user('testuser', 'test@test.com', 'testpass')
        print(f"Usuario creado: {user.username}")
    
    # Autenticar usuario
    login_success = client.login(username='testuser', password='testpass')
    if login_success:
        print("Login exitoso")
    else:
        print("Error en login")
        return
    
    # Datos de prueba para crear pedido
    order_data = {
        "payment_method": "contra_entrega",
        "shipping_address": "Calle 123 #45-67",
        "shipping_city": "Medellín, Antioquia",
        "shipping_phone": "+57 300 123 4567",
        "notes": "Pedido de prueba",
        "items": [
            {
                "product_id": 1,
                "quantity": 2,
                "size": "M",
                "color": "Azul"
            }
        ]
    }
    
    # Crear pedido
    response = client.post('/api/orders/', 
                          data=json.dumps(order_data),
                          content_type='application/json')
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.content.decode()}")
    
    if response.status_code == 201:
        print("Pedido creado exitosamente!")
        order = response.json()
        print(f"Numero de orden: {order.get('order_number')}")
        print(f"Total: ${order.get('total')}")
        print(f"Estado: {order.get('status')}")
    else:
        print("Error al crear pedido")
        if response.status_code == 400:
            print("Errores de validacion:")
            try:
                errors = response.json()
                for field, msgs in errors.items():
                    print(f"  - {field}: {msgs}")
            except:
                print("  No se pudieron parsear los errores")

if __name__ == '__main__':
    test_order_creation()