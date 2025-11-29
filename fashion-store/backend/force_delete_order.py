#!/usr/bin/env python
"""Script para forzar la eliminación de un pedido usando SQL directo"""

import os
import sys
import django

# Configurar Django
sys.path.append('/testbed')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.db import connection
from apps.orders.models import Order

def force_delete_order(order_number):
    """Eliminar pedido forzando con SQL directo"""
    try:
        order = Order.objects.get(order_number=order_number)
        print(f"[*] Encontrando pedido: {order.order_number}")
        print(f"[*] ID del pedido: {order.id}")
        
        with connection.cursor() as cursor:
            print("\n[*] Eliminando referencias con SQL directo...")
            
            # Verificar si hay OrderItems
            cursor.execute("SELECT COUNT(*) FROM orders_orderitem WHERE order_id = ?", [order.id])
            item_count = cursor.fetchone()[0]
            print(f"    - OrderItems a eliminar: {item_count}")
            
            if item_count > 0:
                cursor.execute("DELETE FROM orders_orderitem WHERE order_id = ?", [order.id])
                print("    -> OrderItems eliminados")
            
            # Verificar si hay otras referencias
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
            tables = [row[0] for row in cursor.fetchall()]
            
            print(f"    - Tablas encontradas: {len(tables)}")
            
            # Eliminar referencias en otras tablas que puedan existir
            for table in tables:
                if 'order' in table.lower() and table != 'orders_order':
                    try:
                        cursor.execute(f"DELETE FROM {table} WHERE order_id = ?", [order.id])
                        deleted = cursor.rowcount
                        if deleted > 0:
                            print(f"    - Eliminado {deleted} registros de {table}")
                    except Exception as e:
                        print(f"    - Error eliminando de {table}: {e}")
            
            # Finalmente, eliminar el pedido
            print("\n[*] Eliminando pedido...")
            cursor.execute("DELETE FROM orders_order WHERE id = ?", [order.id])
            
            if cursor.rowcount > 0:
                print("[OK] Pedido eliminado exitosamente usando SQL directo")
            else:
                print("[ERROR] No se pudo eliminar el pedido")
        
        # Verificar que se eliminó
        try:
            Order.objects.get(order_number=order_number)
            print("[ERROR] El pedido aún existe en la base de datos")
        except Order.DoesNotExist:
            print("[OK] Pedido confirmado como eliminado")
        
    except Order.DoesNotExist:
        print(f"[ERROR] Pedido con numero '{order_number}' no encontrado")
    except Exception as e:
        print(f"[ERROR] Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    order_number = "ORD-20251128235714-3301"
    force_delete_order(order_number)