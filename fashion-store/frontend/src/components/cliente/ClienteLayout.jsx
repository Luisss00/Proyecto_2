import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import storeConfigService from '../../services/storeConfig';
import { 
  User, 
  ShoppingBag, 
  Heart, 
  MapPin, 
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  ShoppingCart,
  Package
} from 'lucide-react';
import { useState, useEffect } from 'react';

const ClienteLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [storeConfig, setStoreConfig] = useState(null);

  // Mapeo de rutas a títulos dinámicos
  const routeTitles = {
    '/cliente/perfil': 'Mi Perfil',
    '/cliente/pedidos': 'Mis Pedidos',
    '/cliente/favoritos': 'Mis Favoritos',
    '/cliente/direcciones': 'Mis Direcciones',
    '/cliente/configuracion': 'Configuración',
  };

  // Obtener título de la página actual
  const getCurrentPageTitle = () => {
    const path = location.pathname;
    return routeTitles[path] || 'Mi Cuenta';
  };

  // Cargar configuración de la tienda
  useEffect(() => {
    const loadStoreConfig = async () => {
      try {
        const config = await storeConfigService.getPublicConfig();
        setStoreConfig(config);
      } catch (error) {
        console.error('Error al cargar configuración de tienda:', error);
        // Usar valores por defecto en caso de error
        setStoreConfig({
          store_name: 'Fashion Store',
          logo: null
        });
      }
    };

    loadStoreConfig();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { 
      path: '/productos', 
      icon: ShoppingCart, 
      label: 'Ir a la Tienda',
      description: 'Explorar productos',
      roles: ['cliente'] // Solo para clientes
    },
    { 
      path: '/cliente/perfil', 
      icon: User, 
      label: 'Mi Perfil',
      description: 'Información personal'
    },
    { 
      path: '/cliente/pedidos', 
      icon: ShoppingBag, 
      label: 'Mis Pedidos',
      description: 'Historial de compras'
    },
    { 
      path: '/cliente/favoritos', 
      icon: Heart, 
      label: 'Favoritos',
      description: 'Productos guardados'
    },
    { 
      path: '/cliente/direcciones', 
      icon: MapPin, 
      label: 'Direcciones',
      description: 'Direcciones de envío'
    },
    { 
      path: '/cliente/configuracion', 
      icon: Settings, 
      label: 'Configuración',
      description: 'Ajustes de cuenta'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Navbar Superior */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo y Menú Mobile */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <Menu className="h-6 w-6" />
              </button>
              
              <a href="/" className="flex items-center gap-2">
                <div className="p-2">
                  {storeConfig?.logo_url || storeConfig?.logo ? (
                    <img 
                      src={storeConfig.logo_url || storeConfig.logo} 
                      alt={storeConfig?.store_name || 'Logo'}
                      className="h-12 w-12 object-contain"
                      onError={(e) => {
                        // Si hay error cargando la imagen, usar icono por defecto
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <Package className="h-12 w-12 text-primary-600" />
                  )}
                </div>
                <span className="font-bold text-xl hidden sm:block">
                  {storeConfig?.store_name || 'Fashion Store'}
                </span>
              </a>
            </div>

            {/* Usuario */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.first_name || user?.username}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Cliente
                </p>
              </div>
              <div className="bg-primary-100 dark:bg-primary-900 p-2 rounded-full">
                <User className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sticky top-24">
              <nav className="space-y-1">
                {menuItems
                  .filter(item => !item.roles || item.roles.includes(user?.role))
                  .map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        isActive
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-l-4 border-primary-600'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`
                    }
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{item.label}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {item.description}
                      </p>
                    </div>
                  </NavLink>
                ))}

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors mt-4"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium text-sm">Cerrar Sesión</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Sidebar Mobile */}
          {sidebarOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
              <aside className="w-72 h-full bg-white dark:bg-gray-800 shadow-xl">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Mi Cuenta
                  </h2>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <nav className="p-4 space-y-1">
                  {menuItems
                    .filter(item => !item.roles || item.roles.includes(user?.role))
                    .map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                          isActive
                            ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      <div>
                        <p className="font-medium text-sm">{item.label}</p>
                        <p className="text-xs text-gray-500">{item.description}</p>
                      </div>
                    </NavLink>
                  ))}

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg mt-4"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Cerrar Sesión</span>
                  </button>
                </nav>
              </aside>
            </div>
          )}

          {/* Contenido Principal */}
          <main className="flex-1 min-w-0">
            {/* Breadcrumb/Indicador de página actual */}
            <div className="mb-6">
              <nav className="flex items-center space-x-2 text-sm">
                <a href="/" className="text-gray-500 hover:text-primary-600 transition-colors">
                  Inicio
                </a>
                <span className="text-gray-400">/</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {getCurrentPageTitle()}
                </span>
              </nav>
            </div>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default ClienteLayout;