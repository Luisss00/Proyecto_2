#!/usr/bin/env python3
import os
import sys
import django

# Agregar el directorio del proyecto al path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

import sqlite3

def check_orders_table():
    """Verificar estructura de la tabla orders"""
    
    # Obtener la ruta de la base de datos desde settings
    from django.conf import settings
    db_path = settings.DATABASES['default']['NAME']
    
    print(f"Verificando base de datos: {db_path}")
    print("="*50)
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Obtener información de la tabla orders
        cursor.execute("PRAGMA table_info(orders);")
        columns = cursor.fetchall()
        
        print("ESTRUCTURA ACTUAL DE LA TABLA ORDERS:")
        print("-" * 40)
        for col in columns:
            cid, name, tipo, notnull, default, pk = col
            notnull_str = "NOT NULL" if notnull else "NULL"
            default_str = f"DEFAULT: {default}" if default else "No default"
            print(f"  {name}: {tipo} {notnull_str} {default_str}")
        
        # Verificar si contact_status existe
        column_names = [col[1] for col in columns]
        if 'contact_status' in column_names:
            print(f"\n✅ CAMPO contact_status ENCONTRADO en la base de datos")
            # Obtener detalles específicos del campo
            contact_status_col = next(col for col in columns if col[1] == 'contact_status')
            print(f"   Detalles: {contact_status_col}")
        else:
            print(f"\n❌ CAMPO contact_status NO encontrado en la base de datos")
        
        # Verificar campos en el modelo actual
        from apps.orders.models import Order
        model_fields = [field.name for field in Order._meta.fields]
        print(f"\nCAMPOS EN EL MODELO Order:")
        print("-" * 40)
        for field in model_fields:
            print(f"  - {field}")
        
        if 'contact_status' in model_fields:
            print(f"\n✅ CAMPO contact_status ENCONTRADO en el modelo")
        else:
            print(f"\n❌ CAMPO contact_status NO encontrado en el modelo")
            
        # Verificar discrepancias
        missing_in_model = set([col[1] for col in columns]) - set(model_fields)
        missing_in_db = set(model_fields) - set([col[1] for col in columns])
        
        if missing_in_model:
            print(f"\n⚠️  CAMPOS EN BD PERO NO EN MODELO: {missing_in_model}")
        if missing_in_db:
            print(f"\n⚠️  CAMPOS EN MODELO PERO NO EN BD: {missing_in_db}")
            
    except Exception as e:
        print(f"Error al verificar la base de datos: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    check_orders_table()