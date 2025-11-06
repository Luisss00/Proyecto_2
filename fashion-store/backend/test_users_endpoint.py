#!/usr/bin/env python
import os
import sys
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from django.test import Client
import json

User = get_user_model()

def test_users_endpoint():
    print("Probando endpoints de usuarios...")
    
    # Verificar usuarios en BD
    admin_user = User.objects.filter(role='administrador').first()
    if not admin_user:
        print("No se encontro usuario administrador")
        return
    
    print(f"Usuario admin encontrado: {admin_user.username}")
    
    # Crear cliente y autenticar
    client = Client()
    client.force_login(admin_user)
    
    # Probar endpoint de estadisticas
    print("\nProbando /api/users/statistics/")
    response = client.get('/api/users/statistics/')
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        print(f"Response: {response.json()}")
    else:
        print(f"Error: {response.content.decode()}")
    
    # Probar endpoint de lista de usuarios
    print("\nProbando /api/users/")
    response = client.get('/api/users/')
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        users = response.json()
        print(f"Total usuarios: {len(users)}")
        for user in users[:3]:  # Mostrar solo los primeros 3
            print(f"  - {user['username']} ({user['role']})")
    else:
        print(f"Error: {response.content.decode()}")

if __name__ == '__main__':
    test_users_endpoint()