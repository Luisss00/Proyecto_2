# 🛍️ FASHION STORE
## Guía de Instalación Rápida para Presentación

---

## 🎯 RESUMEN EJECUTIVO

**Fashion Store** es una aplicación de e-commerce completa con:
- ⚛️ **Frontend:** React + Vite + Tailwind CSS
- 🐍 **Backend:** Django + REST Framework
- 🗄️ **Base de Datos:** PostgreSQL
- 🐳 **Containerización:** Docker + Docker Compose

**⏱️ Tiempo de instalación:** 15-30 minutos  
**🎯 Complejidad:** Intermedia  
**💻 OS compatibles:** Windows, macOS, Linux  

---

## 📋 QUICK START - INSTALACIÓN RÁPIDA

### 🚀 MÉTODO 1: DOCKER (RECOMENDADO)

```bash
# 1. Clonar proyecto
git clone [REPO_URL]
cd fashion-store

# 2. Levantar servicios
docker-compose up -d

# 3. ¡Listo!
# Frontend: http://localhost:5173
# Backend:  http://localhost:8000
# Admin BD: http://localhost:5050
```

### 🔧 MÉTODO 2: INSTALACIÓN MANUAL

#### Paso 1: Instalar Dependencias Base
- **Node.js** ≥ 18.0 → [nodejs.org](https://nodejs.org)
- **Python** ≥ 3.11 → [python.org](https://python.org)
- **PostgreSQL** ≥ 13 → [postgresql.org](https://postgresql.org)

#### Paso 2: Configurar Proyecto
```bash
# Frontend
cd frontend
npm install
npm run dev          # Puerto 5173

# Backend (nueva terminal)
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver  # Puerto 8000
```

---

## 🏗️ ARQUITECTURA DEL SISTEMA

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   FRONTEND      │    │    BACKEND      │    │  BASE DE DATOS  │
│   React/Vite    │◄──►│   Django API    │◄──►│   PostgreSQL    │
│   Puerto 5173   │    │   Puerto 8000   │    │   Puerto 5432   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   DOCKER SETUP  │
                    │ Docker-Compose  │
                    └─────────────────┘
```

---

## 🎮 ACCESO Y CREDENCIALES

### 🌐 URLs de Acceso:
| Servicio | URL | Propósito |
|----------|-----|-----------|
| **Frontend** | http://localhost:5173 | Aplicación principal |
| **Backend API** | http://localhost:8000 | API REST |
| **Admin Django** | http://localhost:8000/admin | Administración |
| **pgAdmin** | http://localhost:5050 | Gestión BD |

### 👤 Usuarios de Prueba:
| Rol | Usuario | Contraseña | Acceso |
|-----|---------|------------|--------|
| 🛒 Cliente | `cliente1` | `Cliente123!` | Tienda online |
| 🏪 Vendedor | `vendedor1` | `Vendedor123!` | Gestión productos |
| 👑 Admin | `admin` | `Admin123!` | Panel completo |

---

## ⭐ CARACTERÍSTICAS PRINCIPALES

### 🛍️ Para Clientes:
- ✅ Registro y autenticación
- ✅ Navegación de productos
- ✅ Carrito de compras
- ✅ Proceso de checkout
- ✅ Historial de pedidos
- ✅ Perfil de usuario

### 🏪 Para Vendedores:
- ✅ Dashboard de ventas
- ✅ Gestión de productos
- ✅ Estadísticas básicas
- ✅ Gestión de inventario

### 👑 Para Administradores:
- ✅ Panel de administración completo
- ✅ Gestión de usuarios
- ✅ Gestión de categorías
- ✅ Reportes y estadísticas
- ✅ Configuración del sistema

---

## 🔧 CONFIGURACIÓN RÁPIDA

### 📝 Variables de Entorno (.env)
```bash
# Backend esencial
SECRET_KEY=django-insecure-demo-key
DEBUG=True
DB_NAME=fashion_store
DB_USER=fashion_user
DB_PASSWORD=fashion_pass_2025

# Frontend esencial
VITE_API_URL=http://localhost:8000
VITE_ENVIRONMENT=development
```

### 🎯 Datos Iniciales Automáticos:
- ✅ Usuario administrador
- ✅ Productos de muestra
- ✅ Categorías configuradas
- ✅ Configuración básica de tienda

---

## 📊 VERIFICACIÓN DE INSTALACIÓN

### ✅ Checklist Rápido:
- [ ] **Docker corriendo** → `docker-compose ps`
- [ ] **Frontend responde** → http://localhost:5173
- [ ] **Backend responde** → http://localhost:8000/api/health/
- [ ] **Login funciona** → cliente1 / Cliente123!
- [ ] **Navegación fluida** → Productos → Carrito → Checkout

### 🚨 Tests Rápidos:
```bash
# Test backend
curl http://localhost:8000/api/health/

# Test frontend
curl http://localhost:5173/

# Test base datos
docker-compose exec db psql -U fashion_user -d fashion_store -c "SELECT version();"
```

---

## ⚡ COMANDOS ÚTILES

### 🐳 Docker:
```bash
# Ver servicios
docker-compose ps

# Ver logs
docker-compose logs -f

# Reiniciar servicio
docker-compose restart frontend

# Parar todo
docker-compose down
```

### 🔧 Manual:
```bash
# Frontend
npm run dev      # Desarrollo
npm run build    # Producción

# Backend
python manage.py runserver    # Desarrollo
python manage.py collectstatic # Producción
python manage.py createsuperuser # Admin
```

---

## 🆘 TROUBLESHOOTING RÁPIDO

### ❌ Errores Comunes:

#### "Puerto ocupado"
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Limpiar instalación
rm -rf node_modules package-lock.json
npm install
```

#### "Database connection failed"
```bash
# Verificar PostgreSQL
sudo systemctl status postgresql
# Reiniciar Docker
docker-compose restart db
```

#### "Container no inicia"
```bash
# Reconstruir containers
docker-compose up -d --build --force-recreate
```

---

## 📱 DEMOSTRACIÓN SUGERIDA

### 🎬 Script de Presentación (10 min):

1. **Introducción** (1 min)
   - Mostrar arquitectura visual
   - Mencionar tecnologías

2. **Instalación** (3 min)
   - Mostrar克隆 del repositorio
   - Ejecutar `docker-compose up -d`
   - Ver servicios levantándose

3. **Demostración** (5 min)
   - Login como cliente
   - Navegar productos
   - Agregar al carrito
   - Proceso de checkout
   - Login como admin
   - Panel administrativo

4. **Q&A** (1 min)
   - Comandos adicionales
   - Configuraciones

### 🎯 Puntos Clave a Mostrar:
- ✅ **Facilidad de instalación** → Un solo comando
- ✅ **Funcionalidad completa** → E-commerce real
- ✅ **Interfaz moderna** → React + Tailwind
- ✅ **API robusta** → Django REST
- ✅ **Datos de prueba** → Listo para usar

---

## 🎯 PRÓXIMOS PASOS

### 🔧 Para Desarrolladores:
1. **Explorar código fuente**
2. **Modificar configuraciones**
3. **Agregar nuevas funcionalidades**
4. **Personalizar diseño**

### 📚 Recursos Adicionales:
- **📖 Documentación completa:** `MANUAL_INSTALACION_FASHION_STORE.md`
- **💻 Código fuente:** `fashion-store/`
- **🐛 Issues:** GitHub Issues
- **💬 Soporte:** soporte@fashionstore.com

---

## 🎉 ¡LISTO PARA USAR!

### 🚀 Acceso Inmediato:
- **Tienda Online:** http://localhost:5173
- **Usuario Demo:** `cliente1` / `Cliente123!`
- **Tiempo total:** 5 minutos desde instalación

### 🏆 Beneficios:
- ✅ **Desarrollo rápido** de e-commerce
- ✅ **Tecnología moderna** y escalable
- ✅ **Fácil de personalizar** y extender
- ✅ **Listo para producción** con Docker

---

**🎯 ¡Solo 3 pasos para tener Fashion Store funcionando!**

1. **`git clone`** → Descargar código
2. **`docker-compose up`** → Levantar servicios  
3. **¡Disfrutar!** → Tienda online lista

---

**📞 Soporte:** soporte@fashionstore.com  
**📅 Versión:** 1.0.0  
**📄 Licencia:** MIT  

*© 2025 Fashion Store Development Team*