#!/usr/bin/env python
"""Script simplificado para eliminar un pedido"""

import os
import sys
import django

# Configurar Django
sys.path.append('/testbed')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.db import transaction
from apps.orders.models import Order

def simple_delete_order(order_number):
    """Eliminar pedido con manejo robusto de errores"""
    try:
        order = Order.objects.get(order_number=order_number)
        print(f"[*] Encontrando pedido: {order.order_number}")
        print(f"[*] ID del pedido: {order.id}")
        print(f"[*] Usuario: {order.user.username if order.user else 'NULL'}")
        
        with transaction.atomic():
            # Eliminar todos los OrderItems asociados
            items_deleted, _ = order.items.all().delete()
            print(f"[*] OrderItems eliminados: {items_deleted}")
            
            # Eliminar el pedido
            order.delete()
            print("[OK] Pedido eliminado exitosamente")
        
        # Verificar que se eliminó
        try:
            Order.objects.get(order_number=order_number)
            print("[ERROR] El pedido aún existe!")
        except Order.DoesNotExist:
            print("[OK] Pedido confirmado como eliminado")
            
    except Order.DoesNotExist:
        print(f"[ERROR] Pedido '{order_number}' no encontrado")
    except Exception as e:
        print(f"[ERROR] Error: {e}")
        # Intentar eliminación forzada
        try:
            with transaction.atomic():
                order = Order.objects.filter(order_number=order_number).first()
                if order:
                    print(f"[*] Intentando eliminación forzada del pedido ID: {order.id}")
                    order.delete()
                    print("[OK] Pedido eliminado forzosamente")
                else:
                    print("[ERROR] Pedido no encontrado para eliminación forzada")
        except Exception as e2:
            print(f"[ERROR] Error en eliminación forzada: {e2}")

if __name__ == '__main__':
    order_number = "ORD-20251128235714-3301"
    simple_delete_order(order_number)