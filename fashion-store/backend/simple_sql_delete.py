#!/usr/bin/env python
"""Script simplificado para eliminar pedido usando SQL directo"""

import os
import sys
import django

# Configurar Django
sys.path.append('/testbed')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.db import connection
from apps.orders.models import Order

def simple_sql_delete(order_number):
    """Eliminar pedido usando SQL directo sin parámetros complejos"""
    try:
        order = Order.objects.get(order_number=order_number)
        order_id = order.id
        print(f"[*] Encontrando pedido: {order.order_number}")
        print(f"[*] ID del pedido: {order_id}")
        
        with connection.cursor() as cursor:
            print("\n[*] Iniciando eliminación con SQL directo...")
            
            # Desactivar restricciones FK
            cursor.execute("PRAGMA foreign_keys = OFF")
            print("[*] FK constraints desactivados")
            
            # Eliminar OrderItems (sin parámetros)
            sql_delete_items = f"DELETE FROM order_items WHERE order_id = {order_id}"
            cursor.execute(sql_delete_items)
            items_deleted = cursor.rowcount
            print(f"[*] {items_deleted} OrderItems eliminados")
            
            # Eliminar pedido (sin parámetros)
            sql_delete_order = f"DELETE FROM orders WHERE id = {order_id}"
            cursor.execute(sql_delete_order)
            order_deleted = cursor.rowcount
            print(f"[*] {order_deleted} pedido eliminado")
            
            # Reactivar restricciones FK
            cursor.execute("PRAGMA foreign_keys = ON")
            print("[*] FK constraints reactivados")
            
        print("\n[OK] Eliminación completada exitosamente")
        
        # Verificar eliminación
        try:
            Order.objects.get(order_number=order_number)
            print("[ERROR] El pedido aún existe!")
        except Order.DoesNotExist:
            print("[OK] Pedido eliminado confirmado")
            
    except Order.DoesNotExist:
        print(f"[ERROR] Pedido '{order_number}' no encontrado")
    except Exception as e:
        print(f"[ERROR] Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    order_number = "ORD-20251128235714-3301"
    simple_sql_delete(order_number)