#!/usr/bin/env python
"""Script para verificar las tablas existentes"""

import os
import sys
import django

# Configurar Django
sys.path.append('/testbed')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.db import connection

def check_tables():
    """Verificar todas las tablas en la base de datos"""
    try:
        with connection.cursor() as cursor:
            print("[*] Tablas en la base de datos:")
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
            tables = cursor.fetchall()
            
            for table in tables:
                table_name = table[0]
                print(f"  - {table_name}")
                
                # Ver si contiene datos
                try:
                    cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
                    count = cursor.fetchone()[0]
                    print(f"    Registros: {count}")
                except:
                    print(f"    (Error al contar)")
                
                # Si es una tabla de orders, mostrar algunas filas
                if 'order' in table_name:
                    print(f"    Primeras filas:")
                    try:
                        cursor.execute(f"SELECT * FROM {table_name} LIMIT 3")
                        rows = cursor.fetchall()
                        if rows:
                            columns = [description[0] for description in cursor.description]
                            print(f"      Columnas: {columns}")
                            for i, row in enumerate(rows):
                                print(f"      Fila {i+1}: {row}")
                        else:
                            print(f"      Sin datos")
                    except Exception as e:
                        print(f"      Error: {e}")
                    print()
    except Exception as e:
        print(f"[ERROR] Error: {e}")

if __name__ == '__main__':
    check_tables()