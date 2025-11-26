# 🛍️ MANUAL DE INSTALACIÓN - FASHION STORE
## Versión 1.0.0

---

## 📋 TABLA DE CONTENIDOS

1. [Introducción](#introducción)
2. [Requisitos del Sistema](#requisitos-del-sistema)
3. [Dependencias Necesarias](#dependencias-necesarias)
4. [Instalación en Windows](#instalación-en-windows)
5. [Instalación en macOS](#instalación-en-macos)
6. [Instalación en Linux](#instalación-en-linux)
7. [Instalación con Docker](#instalación-con-docker)
8. [Verificación de Instalación](#verificación-de-instalación)
9. [Solución de Problemas](#solución-de-problemas)
10. [Configuración Inicial](#configuración-inicial)
11. [Desinstalación](#desinstalación)
12. [Soporte Técnico](#soporte-técnico)
13. [Licencia](#licencia)

---

## 📖 INTRODUCCIÓN

Fashion Store es una aplicación web completa de comercio electrónico desarrollada con tecnologías modernas que incluye un frontend en React, un backend en Django, base de datos PostgreSQL y containerización con Docker. Esta guía de instalación proporciona instrucciones detalladas para configurar y ejecutar la aplicación en diferentes sistemas operativos.

### Características Principales:
- 🛍️ Tienda en línea completa
- 👥 Sistema de usuarios con roles (Cliente, Vendedor, Admin)
- 🛒 Carrito de compras funcional
- 📱 Interfaz responsiva con React + Tailwind CSS
- 🔐 Sistema de autenticación JWT
- 📊 API REST con Django REST Framework
- 🐳 Containerización con Docker

---

## 💻 REQUISITOS DEL SISTEMA

### Hardware Mínimo:
- **Procesador:** Intel Core i3 o AMD equivalente (2 GHz)
- **Memoria RAM:** 4 GB (8 GB recomendado)
- **Almacenamiento:** 10 GB de espacio libre
- **Conexión a Internet:** Broadband recomendada

### Hardware Recomendado:
- **Procesador:** Intel Core i5 o AMD equivalente (3 GHz)
- **Memoria RAM:** 8 GB o más
- **Almacenamiento:** 20 GB de espacio libre en SSD
- **Conexión a Internet:** Fibra óptica

### Software Base:
- **Windows:** Windows 10/11 (64-bit)
- **macOS:** macOS 10.15 Catalina o superior
- **Linux:** Ubuntu 18.04 LTS, CentOS 7+, o distribución equivalente

---

## 📦 DEPENDENCIAS NECESARIAS

### Dependencias del Sistema:
```
Node.js >= 18.0.0
Python >= 3.11.0
PostgreSQL >= 13.0
Docker >= 20.0.0
Docker Compose >= 2.0.0
Git >= 2.20.0
```

### Dependencias del Backend (Python):
```
asgiref==3.10.0
certifi==2025.10.5
charset-normalizer==3.4.4
cloudinary==1.44.1
Django==5.2.7
django-cloudinary-storage==0.3.0
django-cors-headers==4.9.0
djangorestframework==3.16.1
djangorestframework_simplejwt==5.5.1
idna==3.11
Pillow==12.0.0
psycopg2-binary==2.9.11
PyJWT==2.10.1
python-decouple==3.8
requests==2.32.5
six==1.17.0
sqlparse==0.5.3
tzdata==2025.2
urllib3==2.5.0
```

### Dependencias del Frontend (Node.js):
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.0",
  "axios": "^1.6.2",
  "jwt-decode": "^4.0.0",
  "react-toastify": "^9.1.3",
  "lucide-react": "^0.263.1",
  "vite": "^5.0.0",
  "@vitejs/plugin-react": "^4.2.0",
  "tailwindcss": "^3.3.5",
  "autoprefixer": "^10.4.16",
  "postcss": "^8.4.32"
}
```

---

## 🪟 INSTALACIÓN EN WINDOWS

### Paso 1: Instalación de Node.js

1. **Descargar Node.js:**
   - Visite https://nodejs.org/
   - Descargue la versión LTS (recomendada): Node.js 18.x o superior
   - Ejecute el instalador (.msi) descargado
   - Siga el asistente de instalación con configuración por defecto

2. **Verificar instalación:**
   ```cmd
   node --version
   npm --version
   ```

### Paso 2: Instalación de Python

1. **Descargar Python:**
   - Visite https://python.org/downloads/
   - Descargue Python 3.11 o superior
   - Durante la instalación, marque "Add Python to PATH"
   - Seleccione "Install for all users"

2. **Verificar instalación:**
   ```cmd
   python --version
   pip --version
   ```

### Paso 3: Instalación de Git

1. **Descargar Git:**
   - Visite https://git-scm.com/download/win
   - Descargue e instale Git for Windows
   - Use configuración por defecto durante la instalación

2. **Verificar instalación:**
   ```cmd
   git --version
   ```

### Paso 4: Instalación de PostgreSQL

1. **Descargar PostgreSQL:**
   - Visite https://www.postgresql.org/download/windows/
   - Descargue el instalador de Windows
   - Ejecute el instalador como administrador
   - Configure una contraseña para el usuario 'postgres'
   - Mantenga el puerto por defecto: 5432

2. **Crear base de datos:**
   ```sql
   CREATE DATABASE fashion_store;
   CREATE USER fashion_user WITH ENCRYPTED PASSWORD 'fashion_pass_2024';
   GRANT ALL PRIVILEGES ON DATABASE fashion_store TO fashion_user;
   ```

### Paso 5: Clonar y Configurar el Proyecto

1. **Clonar repositorio:**
   ```cmd
   git clone [URL_DEL_REPOSITORIO]
   cd fashion-store
   ```

2. **Instalar dependencias del frontend:**
   ```cmd
   cd frontend
   npm install
   ```

3. **Configurar variables de entorno del frontend:**
   ```cmd
   # Crear archivo .env.local en la carpeta frontend
   echo VITE_API_URL=http://localhost:8000 > .env.local
   echo VITE_ENVIRONMENT=development >> .env.local
   ```

4. **Instalar dependencias del backend:**
   ```cmd
   cd ../backend
   pip install -r requirements.txt
   ```

5. **Configurar variables de entorno del backend:**
   ```cmd
   # Crear archivo .env en la carpeta backend
   echo SECRET_KEY=django-insecure-your-secret-key-here > .env
   echo DEBUG=True >> .env
   echo DB_NAME=fashion_store >> .env
   echo DB_USER=fashion_user >> .env
   echo DB_PASSWORD=fashion_pass_2024 >> .env
   echo DB_HOST=localhost >> .env
   echo DB_PORT=5432 >> .env
   echo ALLOWED_HOSTS=localhost,127.0.0.1 >> .env
   ```

### Paso 6: Configuración de la Base de Datos

1. **Ejecutar migraciones:**
   ```cmd
   cd backend
   python manage.py makemigrations
   python manage.py migrate
   ```

2. **Crear usuario administrador:**
   ```cmd
   python manage.py createsuperuser
   ```

3. **Cargar datos iniciales:**
   ```cmd
   python manage.py init_store_config
   python manage.py create_sample_data
   ```

### Paso 7: Ejecutar la Aplicación

1. **Iniciar el backend:**
   ```cmd
   cd backend
   python manage.py runserver
   ```
   El backend estará disponible en: http://localhost:8000

2. **Iniciar el frontend (en otra terminal):**
   ```cmd
   cd frontend
   npm run dev
   ```
   El frontend estará disponible en: http://localhost:5173

---

## 🍎 INSTALACIÓN EN macOS

### Paso 1: Instalación de Homebrew

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Paso 2: Instalación de Node.js

```bash
brew install node
```

### Paso 3: Instalación de Python

```bash
brew install python@3.11
```

### Paso 4: Instalación de PostgreSQL

```bash
brew install postgresql@15
brew services start postgresql@15
```

### Paso 5: Configuración de Base de Datos

```bash
# Crear base de datos
createdb fashion_store
createuser fashion_user --interactive
# Cuando se solicite, establezca la contraseña como: fashion_pass_2024
```

### Paso 6: Clonar y Configurar el Proyecto

```bash
# Clonar repositorio
git clone [URL_DEL_REPOSITORIO]
cd fashion-store

# Configurar frontend
cd frontend
npm install
echo VITE_API_URL=http://localhost:8000 > .env.local
echo VITE_ENVIRONMENT=development >> .env.local

# Configurar backend
cd ../backend
python3 -m pip install -r requirements.txt
echo SECRET_KEY=django-insecure-your-secret-key-here > .env
echo DEBUG=True >> .env
echo DB_NAME=fashion_store >> .env
echo DB_USER=fashion_user >> .env
echo DB_PASSWORD=fashion_pass_2024 >> .env
echo DB_HOST=localhost >> .env
echo DB_PORT=5432 >> .env
echo ALLOWED_HOSTS=localhost,127.0.0.1 >> .env
```

### Paso 7: Configuración de Base de Datos y Ejecución

```bash
# Ejecutar migraciones
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py createsuperuser
python3 manage.py init_store_config
python3 manage.py create_sample_data

# Ejecutar backend
python3 manage.py runserver

# En otra terminal, ejecutar frontend
cd frontend
npm run dev
```

---

## 🐧 INSTALACIÓN EN LINUX

### Ubuntu/Debian:

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar dependencias básicas
sudo apt install -y curl wget git build-essential

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar Python
sudo apt install -y python3.11 python3.11-pip python3.11-venv python3.11-dev

# Instalar PostgreSQL
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Configurar PostgreSQL
sudo -u postgres createdb fashion_store
sudo -u postgres createuser fashion_user --interactive
sudo -u postgres psql -c "ALTER USER fashion_user PASSWORD 'fashion_pass_2024';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE fashion_store TO fashion_user;"
```

### CentOS/RHEL/Fedora:

```bash
# Instalar Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo dnf install -y nodejs npm

# Instalar Python
sudo dnf install -y python3.11 python3.11-pip python3.11-devel

# Instalar PostgreSQL
sudo dnf install -y postgresql postgresql-server postgresql-contrib
sudo postgresql-setup --initdb
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Configurar PostgreSQL
sudo -u postgres createdb fashion_store
sudo -u postgres createuser fashion_user --interactive
sudo -u postgres psql -c "ALTER USER fashion_user PASSWORD 'fashion_pass_2024';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE fashion_store TO fashion_user;"
```

### Configuración del Proyecto (Linux):

```bash
# Clonar y configurar proyecto
git clone [URL_DEL_REPOSITORIO]
cd fashion-store

# Configurar frontend
cd frontend
npm install
echo VITE_API_URL=http://localhost:8000 > .env.local
echo VITE_ENVIRONMENT=development >> .env.local

# Configurar backend
cd ../backend
python3.11 -m pip install -r requirements.txt
echo SECRET_KEY=django-insecure-your-secret-key-here > .env
echo DEBUG=True >> .env
echo DB_NAME=fashion_store >> .env
echo DB_USER=fashion_user >> .env
echo DB_PASSWORD=fashion_pass_2024 >> .env
echo DB_HOST=localhost >> .env
echo DB_PORT=5432 >> .env
echo ALLOWED_HOSTS=localhost,127.0.0.1 >> .env

# Ejecutar migraciones
python3.11 manage.py makemigrations
python3.11 manage.py migrate
python3.11 manage.py createsuperuser
python3.11 manage.py init_store_config
python3.11 manage.py create_sample_data

# Ejecutar aplicación
python3.11 manage.py runserver  # Backend en puerto 8000
npm run dev  # Frontend en puerto 5173
```

---

## 🐳 INSTALACIÓN CON DOCKER

### Prerrequisitos:

1. **Instalar Docker Desktop:**
   - Windows/macOS: https://www.docker.com/products/docker-desktop/
   - Linux: https://docs.docker.com/engine/install/

2. **Verificar instalación:**
   ```bash
   docker --version
   docker-compose --version
   ```

### Instalación Completa con Docker:

```bash
# Clonar repositorio
git clone [URL_DEL_REPOSITORIO]
cd fashion-store

# Levantar todos los servicios
docker-compose up -d

# Ver logs de los servicios
docker-compose logs -f

# Ver estado de los contenedores
docker-compose ps
```

### Servicios Incluidos:
- **Backend:** Puerto 8000 (Django)
- **Frontend:** Puerto 5173 (React/Vite)
- **Base de Datos:** Puerto 5432 (PostgreSQL)
- **pgAdmin:** Puerto 5050 (Administrador de BD)

### Accesos a Docker:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000
- **pgAdmin:** http://localhost:5050
  - Usuario: admin@fashionstore.com
  - Contraseña: admin123

### Comandos Útiles Docker:

```bash
# Detener todos los servicios
docker-compose down

# Reconstruir contenedores
docker-compose up -d --build

# Ver logs específicos
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db

# Acceder al contenedor del backend
docker-compose exec backend bash

# Acceder al contenedor del frontend
docker-compose exec frontend sh

# Acceder a PostgreSQL
docker-compose exec db psql -U fashion_user -d fashion_store

# Reiniciar un servicio específico
docker-compose restart backend
docker-compose restart frontend
```

---

## ✅ VERIFICACIÓN DE INSTALACIÓN

### Verificación del Backend:

1. **Verificar servidor Django:**
   ```bash
   curl http://localhost:8000/api/health/
   ```
   **Respuesta esperada:**
   ```json
   {"status": "ok", "message": "Fashion Store API is running"}
   ```

2. **Verificar migraciones:**
   ```bash
   python manage.py showmigrations
   ```

3. **Verificar superusuario:**
   ```bash
   python manage.py shell
   ```
   ```python
   from django.contrib.auth.models import User
   print(User.objects.filter(is_superuser=True).count())
   # Debería mostrar un número mayor a 0
   ```

### Verificación del Frontend:

1. **Acceder a la aplicación:**
   - Abra navegador en: http://localhost:5173
   - Debería cargar la página principal de Fashion Store

2. **Verificar funcionalidad básica:**
   - Registro de usuario nuevo
   - Login con credenciales existentes
   - Navegación entre páginas

### Verificación de Base de Datos:

1. **Verificar conexión PostgreSQL:**
   ```bash
   psql -h localhost -U fashion_user -d fashion_store
   \dt  -- Ver tablas
   \q   -- Salir
   ```

2. **Verificar tablas Django:**
   ```bash
   python manage.py dbshell
   .tables
   ```

### Verificación con Docker:

```bash
# Verificar que todos los contenedores estén corriendo
docker-compose ps

# Verificar logs sin errores
docker-compose logs --tail=20

# Probar endpoints
curl http://localhost:8000/api/health/
curl http://localhost:5173/
```

---

## 🔧 SOLUCIÓN DE PROBLEMAS

### Problemas Comunes - Frontend:

#### Error: "Puerto 5173 ya está en uso"
```bash
# Solución 1: Matar proceso en el puerto
npx kill-port 5173

# Solución 2: Usar puerto diferente
npm run dev -- --port 3000

# Solución 3: Cambiar en vite.config.js
export default defineConfig({
  server: {
    port: 3000
  }
})
```

#### Error: "Cannot resolve dependency"
```bash
# Limpiar caché de npm
npm cache clean --force

# Eliminar node_modules
rm -rf node_modules
rm package-lock.json

# Reinstalar dependencias
npm install
```

#### Error: "Module not found"
```bash
# Verificar estructura de archivos
ls -la src/

# Reinstalar dependencias
npm install

# Reiniciar servidor de desarrollo
npm run dev
```

### Problemas Comunes - Backend:

#### Error: "Database connection failed"
```bash
# Verificar servicio PostgreSQL
sudo systemctl status postgresql  # Linux
brew services list | grep postgresql  # macOS

# Verificar variables de entorno
python manage.py shell
>>> import os
>>> print(os.getenv('DB_HOST'))
```

#### Error: "ModuleNotFoundError: No module named..."
```bash
# Instalar dependencias faltantes
pip install -r requirements.txt

# Si usa virtual environment, activar primero
source venv/bin/activate  # Linux/macOS
venv\Scripts\activate     # Windows
```

#### Error: "Port 8000 already in use"
```bash
# Usar puerto diferente
python manage.py runserver 8001

# O matar proceso en puerto 8000
fuser -k 8000/tcp  # Linux
lsof -ti:8000 | xargs kill  # macOS
netstat -ano | findstr :8000  # Windows
taskkill /PID <PID> /F
```

### Problemas Comunes - Docker:

#### Error: "Port already in use"
```bash
# Verificar puertos en uso
netstat -tulpn | grep :8000
netstat -tulpn | grep :5173
netstat -tulpn | grep :5432

# Detener servicios conflictivos
docker-compose down
```

#### Error: "Container exited with code 1"
```bash
# Ver logs detallados
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db

# Reconstruir contenedores
docker-compose up -d --build --force-recreate
```

#### Error: "Permission denied"
```bash
# Cambiar permisos de archivos
sudo chown -R $USER:$USER .
chmod +x backend/entrypoint.sh

# En Windows, ejecutar PowerShell como administrador
```

### Problemas de Autenticación:

#### Error: "CSRF verification failed"
```bash
# Verificar CORS settings en backend
# settings.py debe incluir:
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
```

#### Error: "JWT token invalid"
```bash
# Verificar SECRET_KEY en settings.py
# Verificar que JWT_SECRET_KEY esté configurado
# Limpiar localStorage del navegador
```

### Problemas de Rendimiento:

#### Aplicación lenta:
```bash
# Verificar uso de recursos
top  # Linux/macOS
tasklist  # Windows

# Optimizar Docker
docker system prune -a

# Aumentar memoria para Node.js
export NODE_OPTIONS="--max-old-space-size=4096"
```

---

## ⚙️ CONFIGURACIÓN INICIAL

### Configuración del Entorno de Desarrollo:

#### Variables de Entorno del Backend (.env):
```bash
# Configuración básica
SECRET_KEY=django-insecure-your-unique-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Base de datos
DB_NAME=fashion_store
DB_USER=fashion_user
DB_PASSWORD=fashion_pass_2024
DB_HOST=localhost
DB_PORT=5432

# Configuración de Email (opcional)
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=tu-email@gmail.com
EMAIL_HOST_PASSWORD=tu-app-password

# Configuración de archivos estáticos
STATIC_URL=/static/
STATIC_ROOT=staticfiles/
MEDIA_URL=/media/
MEDIA_ROOT=media/

# Configuración de CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

# Configuración JWT
JWT_ACCESS_TOKEN_LIFETIME=5
JWT_REFRESH_TOKEN_LIFETIME=1440
```

#### Variables de Entorno del Frontend (.env.local):
```bash
# API Configuration
VITE_API_URL=http://localhost:8000
VITE_API_TIMEOUT=10000

# Environment
VITE_ENVIRONMENT=development

# Feature Flags
VITE_ENABLE_MOCK_DATA=false
VITE_ENABLE_DEBUG_MODE=true

# External Services (opcional)
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_GOOGLE_ANALYTICS_ID=GA-XXXXX-X
```

### Configuración de Base de Datos:

#### Datos Iniciales:
```bash
# Crear superusuario administrativo
python manage.py createsuperuser

# Configuración inicial de la tienda
python manage.py init_store_config

# Cargar productos de ejemplo
python manage.py create_sample_data

# Crear usuarios de prueba
python manage.py shell
>>> from apps.users.management.commands.create_test_users import Command
>>> Command().handle()
```

#### Usuarios de Prueba:
| Rol | Usuario | Contraseña | Email |
|-----|---------|------------|-------|
| Cliente | cliente1 | Cliente123! | cliente1@test.com |
| Vendedor | vendedor1 | Vendedor123! | vendedor1@test.com |
| Admin | admin | Admin123! | admin@fashionstore.com |

### Configuración de Docker:

#### docker-compose.yml personalizado:
```yaml
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: fashion_store
      POSTGRES_USER: fashion_user
      POSTGRES_PASSWORD: ${DB_PASSWORD:-fashion_pass_2024}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init_db.sql:/docker-entrypoint-initdb.d/init_db.sql
    ports:
      - "${DB_PORT:-5432}:5432"

  backend:
    build: ./backend
    restart: unless-stopped
    command: python manage.py runserver 0.0.0.0:8000
    volumes:
      - ./backend:/app
      - static_volume:/app/staticfiles
      - media_volume:/app/media
    ports:
      - "${BACKEND_PORT:-8000}:8000"
    environment:
      - DEBUG=${DEBUG:-True}
      - SECRET_KEY=${SECRET_KEY}
      - DB_NAME=fashion_store
      - DB_USER=fashion_user
      - DB_PASSWORD=${DB_PASSWORD:-fashion_pass_2024}
      - DB_HOST=db
      - DB_PORT=5432
    depends_on:
      - db

  frontend:
    build: ./frontend
    restart: unless-stopped
    ports:
      - "${FRONTEND_PORT:-5173}:80"
    depends_on:
      - backend

  pgadmin:
    image: dpage/pgadmin4:latest
    restart: unless-stopped
    environment:
      PGADMIN_DEFAULT_EMAIL: ${PGADMIN_EMAIL:-admin@fashionstore.com}
      PGADMIN_DEFAULT_PASSWORD: ${PGADMIN_PASSWORD:-admin123}
    ports:
      - "${PGADMIN_PORT:-5050}:80"
    depends_on:
      - db

volumes:
  postgres_data:
  static_volume:
  media_volume:
  pgadmin_data:
```

#### Archivo .env para Docker:
```bash
# Puertos
FRONTEND_PORT=5173
BACKEND_PORT=8000
DB_PORT=5432
PGADMIN_PORT=5050

# Base de datos
DB_PASSWORD=fashion_pass_2024_secure

# Django
SECRET_KEY=django-insecure-super-secret-key-for-production
DEBUG=False

# pgAdmin
PGADMIN_EMAIL=admin@fashionstore.com
PGADMIN_PASSWORD=admin123_secure
```

### Configuración de Producción:

#### Configuración del Servidor Web:
```nginx
# /etc/nginx/sites-available/fashion-store
server {
    listen 80;
    server_name your-domain.com;

    # Frontend (React)
    location / {
        root /var/www/fashion-store/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API (Django)
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Archivos estáticos
    location /static/ {
        alias /var/www/fashion-store/backend/staticfiles/;
    }

    # Archivos multimedia
    location /media/ {
        alias /var/www/fashion-store/backend/media/;
    }
}
```

#### Configuración de Supervisord:
```ini
# /etc/supervisor/conf.d/fashion-store.conf
[program:fashion-store-backend]
command=/var/www/fashion-store/venv/bin/python manage.py runserver 127.0.0.1:8000
directory=/var/www/fashion-store/backend
user=www-data
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/fashion-store-backend.log
environment=PATH="/var/www/fashion-store/venv/bin"
```

---

## 🗑️ DESINSTALACIÓN

### Desinstalación Manual:

#### Paso 1: Detener Servicios
```bash
# Detener servidor Django (Ctrl+C si está corriendo en terminal)
# Detener servidor de desarrollo React (Ctrl+C)
# O terminar procesos específicos:

# Matar proceso Node.js en puerto 5173
npx kill-port 5173

# Matar proceso Python en puerto 8000
fuser -k 8000/tcp  # Linux/macOS
taskkill /PID <PID> /F  # Windows
```

#### Paso 2: Eliminar Archivos del Proyecto
```bash
# Navegar al directorio padre del proyecto
cd ..

# Eliminar directorio del proyecto (Windows)
rmdir /s /q fashion-store

# Eliminar directorio del proyecto (Linux/macOS)
rm -rf fashion-store
```

#### Paso 3: Desinstalar Dependencias del Sistema

**Windows:**
```cmd
# Desinstalar Node.js desde Panel de Control > Programas
# Desinstalar Python desde Panel de Control > Programas
# Desinstalar Git desde Panel de Control > Programas
# Desinstalar PostgreSQL desde Panel de Control > Programas
```

**macOS:**
```bash
# Desinstalar con Homebrew
brew uninstall node python@3.11 postgresql@15

# Desinstalar Homebrew (opcional)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/uninstall.sh)"
```

**Linux (Ubuntu/Debian):**
```bash
# Desinstalar paquetes
sudo apt remove --purge nodejs npm python3.11 python3.11-pip
sudo apt autoremove

# Desinstalar PostgreSQL
sudo apt remove --purge postgresql postgresql-contrib
sudo rm -rf /etc/postgresql/
sudo rm -rf /var/lib/postgresql/

# Limpiar repositorios
sudo add-apt-repository --remove nodejs/node
```

**Linux (CentOS/RHEL/Fedora):**
```bash
# Desinstalar paquetes
sudo dnf remove -y nodejs npm python3.11 python3.11-pip

# Desinstalar PostgreSQL
sudo dnf remove -y postgresql postgresql-server postgresql-contrib
sudo rm -rf /var/lib/pgsql/
```

#### Paso 4: Eliminar Base de Datos
```bash
# Conectarse a PostgreSQL como superusuario
sudo -u postgres psql

# Eliminar base de datos y usuario
DROP DATABASE IF EXISTS fashion_store;
DROP USER IF EXISTS fashion_user;

# Salir de PostgreSQL
\q
```

#### Paso 5: Limpiar Archivos de Configuración

**Windows:**
```cmd
# Eliminar carpetas de configuración
rmdir /s /q %APPDATA%\npm
rmdir /s /q %APPDATA%\Python
rmdir /s /q %USERPROFILE%\.gitconfig
```

**Linux/macOS:**
```bash
# Eliminar carpetas de configuración
rm -rf ~/.npm
rm -rf ~/.pip
rm -rf ~/.gitconfig
rm -rf ~/.bashrc  # Si se añadieron alias

# Limpiar variables de entorno
sed -i '/PATH.*nodejs/d' ~/.bashrc
sed -i '/PATH.*python3.11/d' ~/.bashrc
```

### Desinstalación con Docker:

#### Paso 1: Detener y Eliminar Contenedores
```bash
# Detener todos los servicios
docker-compose down

# Eliminar volúmenes (¡CUIDADO: Esto elimina todos los datos!)
docker-compose down -v

# Eliminar imágenes
docker-compose down --rmi all

# Limpiar sistema Docker
docker system prune -a
```

#### Paso 2: Desinstalar Docker

**Windows:**
- Desinstalar Docker Desktop desde Panel de Control

**macOS:**
```bash
# Desinstalar Docker Desktop
brew cask uninstall docker

# O si se instaló con .dmg, arrastrar a la papelera
```

**Linux:**
```bash
# Ubuntu/Debian
sudo apt remove docker-ce docker-ce-cli containerd.io
sudo apt autoremove

# CentOS/RHEL/Fedora
sudo dnf remove docker-ce docker-ce-cli containerd.io
sudo dnf autoremove

# Limpiar datos
sudo rm -rf /var/lib/docker
sudo rm -rf /var/lib/containerd
```

### Desinstalación Completa (Todos los Métodos):

#### Script de Limpieza Automática:
```bash
#!/bin/bash
# cleanup_fashion_store.sh

echo "🧹 Iniciando desinstalación completa de Fashion Store..."

# Detener procesos
echo "⏹️ Detenendo procesos..."
pkill -f "python.*manage.py runserver" 2>/dev/null || true
pkill -f "npm.*dev" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true

# Detener Docker si existe
echo "🐳 Deteniendo Docker..."
docker-compose down 2>/dev/null || true

# Eliminar directorios del proyecto
echo "📁 Eliminando archivos del proyecto..."
rm -rf fashion-store 2>/dev/null || true

# Limpiar Node.js
echo "🟢 Limpiando Node.js..."
rm -rf node_modules package-lock.json 2>/dev/null || true
npm cache clean --force 2>/dev/null || true

# Limpiar Python
echo "🐍 Limpiando Python..."
rm -rf __pycache__ *.pyc 2>/dev/null || true
pip cache purge 2>/dev/null || true

# Limpiar base de datos local
echo "🗄️ Limpiando base de datos..."
rm -rf db.sqlite3 2>/dev/null || true

# Desinstalar dependencias (opcional)
read -p "¿Desea desinstalar Node.js, Python y PostgreSQL? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Código de desinstalación específico del sistema operativo
    echo "🗑️ Desinstalando dependencias del sistema..."
fi

echo "✅ Desinstalación completada!"
```

### Verificación de Desinstalación:

#### Verificar que no queden procesos:
```bash
# Verificar procesos Node.js
ps aux | grep node

# Verificar procesos Python
ps aux | grep python

# Verificar procesos PostgreSQL
ps aux | grep postgres

# Verificar puertos en uso
netstat -tulpn | grep -E ":8000|:5173|:5432"
```

#### Verificar instalación de Docker:
```bash
# Verificar contenedores
docker ps -a

# Verificar imágenes
docker images

# Verificar volúmenes
docker volume ls
```

---

## 🆘 SOPORTE TÉCNICO

### Información de Contacto:

#### Soporte General:
- **Email:** soporte@fashionstore.com
- **Teléfono:** +57 (1) 234-5678
- **Horario de atención:** Lunes a Viernes, 8:00 AM - 6:00 PM (GMT-5)

#### Soporte Técnico:
- **Email técnico:** tech@fashionstore.com
- **GitHub Issues:** https://github.com/Luisss00/fashion-store/issues
- **Documentación:** https://docs.fashionstore.com

#### Soporte de Instalación:
- **Email instalación:** install@fashionstore.com
- **Foro de comunidad:** https://community.fashionstore.com
- **Chat en vivo:** Disponible en la documentación oficial

### Recursos de Ayuda:

#### Documentación:
- [Manual de Instalación](MANUAL_INSTALACION_FASHION_STORE.md)
- [Guía de Desarrollo](DESARROLLO.md)
- [API Reference](API_DOCUMENTATION.md)
- [Troubleshooting Guide](TROUBLESHOOTING.md)

#### Videos Tutoriales:
- [Instalación en Windows](https://youtube.com/watch?v=windows-install)
- [Instalación en macOS](https://youtube.com/watch?v=macos-install)
- [Instalación en Linux](https://youtube.com/watch?v=linux-install)
- [Configuración con Docker](https://youtube.com/watch?v=docker-setup)

#### Comunidad:
- [Discord](https://discord.gg/fashionstore)
- [Telegram](https://t.me/fashionstore)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/fashion-store)

### Información para Reportar Problemas:

#### Plantilla de Issue:
```
## Descripción del Problema
Descripción clara y concisa del problema.

## Pasos para Reproducir
1. Ir a '...'
2. Hacer clic en '...'
3. Scroll hasta '...'
4. Ver error

## Comportamiento Esperado
Descripción de lo que esperaba que pasara.

## Screenshots
Si es aplicable, agregar screenshots del problema.

## Información del Entorno
- OS: [e.g. Windows 10, macOS Big Sur, Ubuntu 20.04]
- Navegador: [e.g. Chrome 91, Safari 14, Firefox 89]
- Versión de Node.js: [e.g. 18.0.0]
- Versión de Python: [e.g. 3.11.0]
- Versión de PostgreSQL: [e.g. 15.0]

## Logs Relevantes
```bash
# Agregar logs aquí
```

## Información Adicional
Cualquier otra información sobre el problema.
```

#### Información a Incluir:
1. **Sistema operativo y versión**
2. **Versiones de Node.js, Python, PostgreSQL**
3. **Comandos exactos ejecutados**
4. **Mensajes de error completos**
5. **Logs de la aplicación**
6. **Configuración de variables de entorno** (sin datos sensibles)

### Problemas Conocidos y Soluciones:

| Problema | Estado | Solución |
|----------|--------|----------|
| Puerto 5173 ocupado | Conocido | Usar `npm run dev -- --port 3000` |
| Error de migración Django | Conocido | `python manage.py migrate --run-syncdb` |
| CORS errors en desarrollo | Conocido | Verificar `CORS_ALLOWED_ORIGINS` |
| Docker container no inicia | Conocido | `docker-compose up -d --build` |
| Base de datos no conecta | Conocido | Verificar credenciales en `.env` |

### Actualizaciones y Noticias:

- **Newsletter:** Suscribirse en https://fashionstore.com/newsletter
- **Release Notes:** https://github.com/Luisss00/fashion-store/releases
- **Blog:** https://blog.fashionstore.com
- **Twitter:** @FashionStoreDev

---

## 📜 LICENCIA

### Fashion Store - Licencia MIT

Copyright (c) 2025 Fashion Store Development Team

Por la presente se concede permiso, libre de cargos, a cualquier persona que obtenga una copia de este software y de los archivos de documentación asociados (el "Software"), a utilizar el Software sin restricción, incluyendo sin limitación los derechos a usar, copiar, modificar, fusionar, publicar, distribuir, sublicenciar, y/o vender copias del Software, y a permitir a las personas a las que se les proporcione el Software a hacer lo mismo, sujeto a las siguientes condiciones:

El aviso de copyright anterior y este aviso de permiso se incluirán en todas las copias o partes sustanciales del Software.

EL SOFTWARE SE PROPORCIONA "COMO ESTÁ", SIN GARANTÍA DE NINGÚN TIPO, EXPRESA O IMPLÍCITA, INCLUYENDO PERO NO LIMITADO A GARANTÍAS DE COMERCIALIZACIÓN, IDONEIDAD PARA UN PROPÓSITO PARTICULAR E INCUMPLIMIENTO. EN NINGÚN CASO LOS AUTORES O PROPIETARIOS DE LOS DERECHOS DE AUTOR SERÁN RESPONSABLES DE NINGUNA RECLAMACIÓN, DAÑOS U OTRAS RESPONSABILIDADES, YA SEA EN UNA ACCIÓN DE CONTRATO, AGRAVIO O CUALQUIER OTRO MOTIVO, DERIVADAS DE, FUERA DE O EN CONEXIÓN CON EL SOFTWARE O SU USO U OTRO TIPO DE ACCIONES EN EL SOFTWARE.

### Dependencias de Terceros:

#### Frontend Dependencies:
- React (MIT License) - https://reactjs.org/
- Axios (MIT License) - https://axios-http.com/
- Tailwind CSS (MIT License) - https://tailwindcss.com/
- Vite (MIT License) - https://vitejs.dev/
- Lucide Icons (ISC License) - https://lucide.dev/

#### Backend Dependencies:
- Django (BSD License) - https://www.djangoproject.com/
- Django REST Framework (BSD License) - https://www.django-rest-framework.org/
- PostgreSQL (PostgreSQL License) - https://www.postgresql.org/
- Pillow (PIL License) - https://pillow.readthedocs.io/

#### Infrastructure:
- Docker (Apache 2.0 License) - https://www.docker.com/
- Nginx (2-clause BSD-like License) - https://nginx.org/

### Atribuciones:

#### Imágenes de Producto:
Las imágenes de producto utilizadas en este proyecto son de uso libre y han sido obtenidas de:
- Unsplash (Unsplash License) - https://unsplash.com/
- Pexels (Pexels License) - https://www.pexels.com/

#### Fuentes:
- Inter (SIL Open Font License) - https://rsms.me/inter/

### Limitaciones de Uso Comercial:

Este software está disponible bajo la Licencia MIT, lo que permite su uso comercial. Sin embargo, se requiere:

1. **Atribución:** Incluir el aviso de copyright en derivados del software
2. **Aviso de Licencia:** Incluir el texto de la licencia MIT
3. **Exención de Responsabilidad:** El software se proporciona "tal como está"

### Contribuciones:

Las contribuciones a este proyecto están bajo la misma Licencia MIT. Al contribuir, usted acepta que sus contribuciones serán licenciadas bajo los términos de la Licencia MIT.

### Contacto Legal:

Para consultas relacionadas con la licencia o uso comercial:
- **Email legal:** legal@fashionstore.com
- **Dirección postal:** Fashion Store Legal Department, Calle 123 #45-67, Bogotá, Colombia

---

## 🎉 CONCLUSIÓN

¡Felicidades! Has completado la instalación de Fashion Store. Este manual proporciona todas las herramientas necesarias para instalar, configurar y mantener la aplicación en diferentes entornos.

### Próximos Pasos:

1. **Explora la aplicación** accediendo a http://localhost:5173
2. **Registra una cuenta** nueva o usa las credenciales de prueba
3. **Explora el código fuente** para entender la arquitectura
4. **Consulta la documentación de desarrollo** para contribuir

### Recursos Adicionales:

- 📖 [Documentación Completa](https://docs.fashionstore.com)
- 🎥 [Video Tutoriales](https://youtube.com/c/FashionStore)
- 💬 [Comunidad Discord](https://discord.gg/fashionstore)
- 📧 [Soporte Técnico](soporte@fashionstore.com)

---

**Versión del Manual:** 1.0.0  
**Última Actualización:** 26 de Noviembre de 2025  
**Compatibilidad:** Fashion Store v1.0.0

---

*© 2025 Fashion Store Development Team. Todos los derechos reservados.*