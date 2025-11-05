#!/usr/bin/env python
import os
import sys
import django
from django.contrib.auth import authenticate

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.users.models import User

def create_users():
    try:
        # Crear vendedor
        vendedor, created = User.objects.get_or_create(
            username='vendedor1',
            defaults={
                'email': 'vendedor1@example.com',
                'role': 'vendedor',
                'is_staff': False,
                'is_superuser': False,
                'is_active': True
            }
        )
        
        if created:
            vendedor.set_password('Vendedor123!')
            vendedor.save()
            print(f'Vendedor creado: {vendedor.username}')
        else:
            vendedor.set_password('Vendedor123!')
            vendedor.save()
            print(f'Vendedor ya existe, contraseña actualizada: {vendedor.username}')
        
        # Crear cliente
        cliente, created = User.objects.get_or_create(
            username='cliente1',
            defaults={
                'email': 'cliente1@example.com',
                'role': 'cliente',
                'is_staff': False,
                'is_superuser': False,
                'is_active': True
            }
        )
        
        if created:
            cliente.set_password('Cliente123!')
            cliente.save()
            print(f'Cliente creado: {cliente.username}')
        else:
            cliente.set_password('Cliente123!')
            cliente.save()
            print(f'Cliente ya existe, contraseña actualizada: {cliente.username}')
            
        # Obtener usuarios para verificación
        vendedor_user = User.objects.get(username='vendedor1')
        cliente_user = User.objects.get(username='cliente1')
            
        # Verificar credenciales
        print('\n=== VERIFICACIÓN DE CREDENCIALES ===')
        
        # Verificar admin
        try:
            admin_user = User.objects.get(username='admin')
            admin_auth = authenticate(username='admin', password='Admin123!')
            print(f'Admin: {admin_user.username}, Rol: {admin_user.role}, Credenciales: {"✓ Correctas" if admin_auth else "✗ Incorrectas"}')
        except User.DoesNotExist:
            print('Admin: No encontrado')
        
        # Verificar vendedor
        vendedor_auth = authenticate(username='vendedor1', password='Vendedor123!')
        print(f'Vendedor: {vendedor_user.username}, Rol: {vendedor_user.role}, Credenciales: {"✓ Correctas" if vendedor_auth else "✗ Incorrectas"}')
        
        # Verificar cliente
        cliente_auth = authenticate(username='cliente1', password='Cliente123!')
        print(f'Cliente: {cliente_user.username}, Rol: {cliente_user.role}, Credenciales: {"✓ Correctas" if cliente_auth else "✗ Incorrectas"}')
            
        # Verificar todos los usuarios
        print('\n=== USUARIOS EN EL SISTEMA ===')
        for user in User.objects.all():
            print(f'Usuario: {user.username}, Email: {user.email}, Rol: {user.role}')
            
    except Exception as e:
        print(f'Error: {e}')

if __name__ == '__main__':
    create_users()