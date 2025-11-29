#!/usr/bin/env python3
"""
Script para corregir los totales de pedidos que tienen valores NaN o incorrectos.
"""

import os
import sys
import django
from decimal import Decimal

# Configurar Django
sys.path.append('/app')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.orders.models import Order

def fix_order_totals():
    """Corregir totales de pedidos con valores NaN o incorrectos"""
    print("Iniciando correccion de totales de pedidos...")
    
    # Obtener todas las ordenes
    orders = Order.objects.all()
    fixed_count = 0
    error_count = 0
    
    for order in orders:
        try:
            # Verificar si necesita correccion
            needs_fix = False
            
            # Verificar subtotal
            if order.subtotal is None or str(order.subtotal) == 'NaN':
                print(f"Order {order.order_number}: subtotal invalido ({order.subtotal})")
                needs_fix = True
            
            # Verificar tax
            if order.tax is None or str(order.tax) == 'NaN':
                print(f"Order {order.order_number}: tax invalido ({order.tax})")
                needs_fix = True
                
            # Verificar total
            if order.total is None or str(order.total) == 'NaN':
                print(f"Order {order.order_number}: total invalido ({order.total})")
                needs_fix = True
            
            # Si necesita correccion
            if needs_fix:
                print(f"Corrigiendo orden {order.order_number}...")
                
                # Recalcular totales
                order.calculate_totals()
                
                print(f"Order {order.order_number}: corregido")
                print(f"   - Subtotal: {order.subtotal}")
                print(f"   - Tax: {order.tax}")
                print(f"   - Shipping: {order.shipping_cost}")
                print(f"   - Total: {order.total}")
                print()
                
                fixed_count += 1
            else:
                print(f"Order {order.order_number}: ya esta correcto")
                
        except Exception as e:
            print(f"Error procesando orden {order.order_number}: {e}")
            error_count += 1
    
    print(f"\nResumen:")
    print(f"   - Ordenes corregidas: {fixed_count}")
    print(f"   - Errores: {error_count}")
    print(f"   - Total de ordenes procesadas: {orders.count()}")
    
    if fixed_count > 0:
        print(f"\nSe corrigieron {fixed_count} ordenes con valores NaN o incorrectos")
    else:
        print(f"\nTodas las ordenes tienen valores correctos")

if __name__ == "__main__":
    fix_order_totals()