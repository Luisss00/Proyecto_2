#!/usr/bin/env python
"""Script para eliminar un pedido específico"""

import os
import sys
import django

# Configurar Django
sys.path.append('/testbed')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.orders.models import Order

def delete_order_by_number(order_number):
    """Eliminar pedido por número de orden"""
    try:
        order = Order.objects.get(order_number=order_number)
        print(f"[*] Encontrando pedido: {order.order_number}")
        print(f"[*] Usuario: {order.user.username}")
        print(f"[*] Total: ${order.total}")
        print(f"[*] Fecha: {order.created_at}")
        
        # Eliminar el pedido (incluye eliminación en cascada de OrderItems)
        order.delete()
        print("[OK] Pedido eliminado exitosamente")
        
    except Order.DoesNotExist:
        print(f"[ERROR] Pedido con numero '{order_number}' no encontrado")
    except Exception as e:
        print(f"[ERROR] Error al eliminar pedido: {e}")

if __name__ == '__main__':
    order_number = "ORD-20251128235714-3301"
    delete_order_by_number(order_number)