#!/usr/bin/env python
"""Script para analizar referencias a un pedido específico"""

import os
import sys
import django

# Configurar Django
sys.path.append('/testbed')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.db import connection
from apps.orders.models import Order

def analyze_order_references(order_number):
    """Analizar todas las referencias a un pedido específico"""
    try:
        order = Order.objects.get(order_number=order_number)
        print(f"[*] Analizando pedido: {order.order_number}")
        print(f"[*] ID del pedido: {order.id}")
        
        # Verificar OrderItems
        items = order.items.all()
        print(f"[*] OrderItems asociados: {items.count()}")
        for item in items:
            print(f"    - Item ID: {item.id}, Product ID: {item.product_id if item.product else 'NULL'}")
        
        # Verificar si hay referencias en otras tablas
        print("\n[*] Verificando referencias en otras tablas...")
        
        # Lista de posibles tablas que podrían referenciar orders
        tables_to_check = [
            'cart_cartitem',
            'favorites_favorite', 
            'orders_orderitem',
            'users_user'
        ]
        
        with connection.cursor() as cursor:
            for table in tables_to_check:
                try:
                    cursor.execute(f"SELECT name FROM sqlite_master WHERE type='table' AND name='{table}'")
                    if cursor.fetchone():
                        print(f"    - Tabla {table} existe")
                        
                        # Verificar referencias directas
                        if 'order' in table.lower():
                            cursor.execute(f"SELECT * FROM {table} WHERE order_id = ?", [order.id])
                            references = cursor.fetchall()
                            if references:
                                print(f"      -> {len(references)} referencias encontradas")
                            else:
                                print(f"      -> Sin referencias a este pedido")
                except Exception as e:
                    print(f"    - Error verificando {table}: {e}")
        
        print("\n[*] Intentando eliminar OrderItems primero...")
        deleted_items = items.delete()
        print(f"    -> OrderItems eliminados: {deleted_items}")
        
        print("\n[*] Intentando eliminar pedido...")
        order.delete()
        print("[OK] Pedido eliminado exitosamente")
        
    except Order.DoesNotExist:
        print(f"[ERROR] Pedido con numero '{order_number}' no encontrado")
    except Exception as e:
        print(f"[ERROR] Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    order_number = "ORD-20251128235714-3301"
    analyze_order_references(order_number)