#!/usr/bin/env python
"""Script para verificar si el pedido fue eliminado"""

import os
import sys
import django

# Configurar Django
sys.path.append('/testbed')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.orders.models import Order

def verify_order_deletion(order_number):
    """Verificar si el pedido fue eliminado"""
    try:
        order = Order.objects.get(order_number=order_number)
        print(f"[ERROR] Pedido aún existe: {order.order_number}")
        print(f"    ID: {order.id}")
        print(f"    Usuario: {order.user.username if order.user else 'NULL'}")
        
    except Order.DoesNotExist:
        print(f"[OK] Pedido '{order_number}' fue eliminado exitosamente")
        
        # Verificar si quedan otros pedidos
        total_orders = Order.objects.count()
        print(f"    Total de pedidos restantes: {total_orders}")
        
        if total_orders > 0:
            print("    Pedidos restantes:")
            for order in Order.objects.all()[:5]:  # Mostrar solo los primeros 5
                print(f"      - {order.order_number} (Usuario: {order.user.username})")
    
    except Exception as e:
        print(f"[ERROR] Error verificando: {e}")

if __name__ == '__main__':
    order_number = "ORD-20251128235714-3301"
    verify_order_deletion(order_number)