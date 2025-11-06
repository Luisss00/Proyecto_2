#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.users.models import User

print("Verificando configuracion de administrador...")
print()

# Verificar todos los usuarios
users = User.objects.all()
print(f"Total usuarios en BD: {users.count()}")
print()

for user in users:
    print(f"Usuario: {user.username}")
    print(f"   Email: {user.email}")
    print(f"   Rol: {user.role}")
    print(f"   Activo: {user.is_active}")
    print(f"   Staff: {user.is_staff}")
    print(f"   Superuser: {user.is_superuser}")
    print()

# Verificar especificamente administradores
admin = User.objects.filter(role='administrador').first()
if admin:
    print(f"Administrador encontrado: {admin.username}")
    
    # Verificar si puede acceder al admin
    if admin.is_staff:
        print("TIENE permisos de staff (puede acceder al admin)")
    else:
        print("NO tiene permisos de staff (NO puede acceder al admin)")
        
    if admin.is_superuser:
        print("Es superuser (acceso completo al admin)")
    else:
        print("NO es superuser (acceso limitado al admin)")
        
    # Estadisticas
    print()
    print("Estadisticas por rol:")
    print(f"   Administradores: {User.objects.filter(role='administrador').count()}")
    print(f"   Vendedores: {User.objects.filter(role='vendedor').count()}")
    print(f"   Clientes: {User.objects.filter(role='cliente').count()}")
    
else:
    print("No se encontro ningun administrador")