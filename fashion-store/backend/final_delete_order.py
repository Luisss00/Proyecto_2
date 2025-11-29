#!/usr/bin/env python
"""Script final para eliminar pedido desactivando FK constraints"""

import os
import sys
import django

# Configurar Django
sys.path.append('/testbed')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.db import connection

def final_delete_order(order_number):
    """Eliminar pedido desactivando restricciones FK"""
    try:
        # Obtener el pedido primero
        from apps.orders.models import Order
        order = Order.objects.get(order_number=order_number)
        order_id = order.id
        print(f"[*] Encontrando pedido: {order.order_number}")
        print(f"[*] ID del pedido: {order_id}")
        
        with connection.cursor() as cursor:
            print("\n[*] Desactivando restricciones de claves foráneas...")
            
            # Para SQLite, necesitamos usar PRAGMA
            cursor.execute("PRAGMA foreign_keys = OFF")
            
            # Eliminar OrderItems primero
            print("[*] Eliminando OrderItems...")
            cursor.execute("DELETE FROM orders_orderitem WHERE order_id = ?", [order_id])
            items_deleted = cursor.rowcount
            print(f"    -> {items_deleted} OrderItems eliminados")
            
            # Eliminar el pedido
            print("[*] Eliminando pedido...")
            cursor.execute("DELETE FROM orders_order WHERE id = ?", [order_id])
            if cursor.rowcount > 0:
                print("    -> Pedido eliminado de la tabla orders")
            
            # Reactivar restricciones FK
            cursor.execute("PRAGMA foreign_keys = ON")
            print("[*] Restricciones reactivadas")
            
        print("\n[OK] Pedido eliminado exitosamente")
        
        # Verificar eliminación
        try:
            Order.objects.get(order_number=order_number)
            print("[ERROR] El pedido aún existe!")
        except Order.DoesNotExist:
            print("[OK] Pedido confirmado como eliminado de la base de datos")
            
    except Order.DoesNotExist:
        print(f"[ERROR] Pedido '{order_number}' no encontrado")
    except Exception as e:
        print(f"[ERROR] Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    order_number = "ORD-20251128235714-3301"
    final_delete_order(order_number)