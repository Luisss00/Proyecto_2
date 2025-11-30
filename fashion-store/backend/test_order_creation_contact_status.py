#!/usr/bin/env python3
import os
import sys
import django

# Agregar el directorio del proyecto al path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

def test_order_creation():
    """Probar creación de orden para verificar que el error esté solucionado"""
    
    try:
        from apps.orders.models import Order
        from apps.users.models import User
        
        print("Probando creación de orden...")
        print("=" * 40)
        
        # Obtener o crear un usuario de prueba
        test_user, created = User.objects.get_or_create(
            username='test_user_contact',
            defaults={
                'email': 'test_contact@example.com',
                'first_name': 'Test',
                'last_name': 'User'
            }
        )
        
        if created:
            test_user.set_password('test123')
            test_user.save()
            print(f"Usuario de prueba creado: {test_user.username}")
        else:
            print(f"Usando usuario existente: {test_user.username}")
        
        # Crear orden de prueba
        test_order = Order.objects.create(
            user=test_user,
            payment_method='nequi',
            shipping_address='Dirección de prueba 123',
            shipping_city='Bogotá',
            shipping_phone='3001234567',
            subtotal=100.00,
            tax=19.00,
            total=119.00,
            notes='Orden de prueba para verificar contact_status'
        )
        
        print(f"Orden creada exitosamente: {test_order.order_number}")
        print(f"ID de la orden: {test_order.id}")
        print(f"Estado: {test_order.status}")
        print(f"Fecha de creación: {test_order.created_at}")
        
        # Verificar campos en la base de datos
        from django.db import connection
        cursor = connection.cursor()
        cursor.execute("PRAGMA table_info(orders);")
        columns = cursor.fetchall()
        
        column_names = [col[1] for col in columns]
        print(f"\nCampos en la tabla orders: {', '.join(column_names)}")
        
        if 'contact_status' in column_names:
            print("Campo contact_status presente en la BD")
            # Verificar valor del campo
            cursor.execute("SELECT contact_status FROM orders WHERE id = ?", [test_order.id])
            contact_status = cursor.fetchone()[0]
            print(f"Valor de contact_status: {contact_status}")
        else:
            print("Campo contact_status NO presente en la BD")
        
        # Limpiar orden de prueba
        test_order.delete()
        print(f"\nOrden de prueba eliminada.")
        
        print(f"\n✅ PRUEBA EXITOSA: La creación de órdenes funciona correctamente")
        
    except Exception as e:
        print(f"\n❌ ERROR: {type(e).__name__}: {str(e)}")
        return False
    
    return True

def check_migration_status():
    """Verificar estado de migraciones"""
    print("\nVerificando estado de migraciones...")
    print("=" * 40)
    
    os.system('cd fashion-store/backend && python manage.py showmigrations orders')

if __name__ == "__main__":
    print("VERIFICACIÓN DE SOLUCIÓN CONTACT_STATUS")
    print("=" * 50)
    
    # Verificar migraciones
    check_migration_status()
    
    # Probar creación de orden
    success = test_order_creation()
    
    if success:
        print("\n🎉 VERIFICACIÓN COMPLETADA: El problema está resuelto")
    else:
        print("\n⚠️ VERIFICACIÓN FALLIDA: Se requiere atención adicional")