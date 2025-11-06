#!/usr/bin/env python
import requests
import json

def test_frontend_api():
    print("Simulando llamada del frontend a la API...")
    
    # Login igual que el frontend
    login_data = {
        'username': 'admin',
        'password': 'admin'
    }
    
    try:
        # 1. Login
        print("\n1. Haciendo login...")
        response = requests.post('http://localhost:8000/api/auth/login/', json=login_data)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            token = data.get('access')
            print("Login exitoso")
            
            # 2. Obtener usuarios (como userService.getAll())
            print("\n2. Obteniendo usuarios (userService.getAll())...")
            headers = {'Authorization': f'Bearer {token}'}
            response = requests.get('http://localhost:8000/api/users/', headers=headers)
            print(f"Status: {response.status_code}")
            
            if response.status_code == 200:
                users = response.json()
                print(f"Usuarios obtenidos: {len(users)}")
                
                # 3. Simular el conteo que hace el frontend
                print("\n3. Simulando conteo del frontend...")
                
                # Contar administradores
                administradores = len([u for u in users if u.get('role') == 'administrador'])
                print(f"   Administradores: {administradores}")
                
                # Contar vendedores
                vendedores = len([u for u in users if u.get('role') == 'vendedor'])
                print(f"   Vendedores: {vendedores}")
                
                # Contar clientes
                clientes = len([u for u in users if u.get('role') == 'cliente'])
                print(f"   Clientes: {clientes}")
                
                # Mostrar todos los usuarios
                print(f"\n4. Lista completa de usuarios:")
                for i, user in enumerate(users, 1):
                    print(f"   {i}. {user.get('username')} - {user.get('role')}")
                
                # Verificar si hay algún usuario con datos vacíos
                usuarios_sin_rol = [u for u in users if not u.get('role')]
                if usuarios_sin_rol:
                    print(f"\nUsuarios sin rol: {len(usuarios_sin_rol)}")
                    for u in usuarios_sin_rol:
                        print(f"   - {u.get('username')}: {u}")
                
            else:
                print(f"Error obteniendo usuarios: {response.text}")
        else:
            print(f"Error en login: {response.status_code} - {response.text}")
            
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == '__main__':
    test_frontend_api()