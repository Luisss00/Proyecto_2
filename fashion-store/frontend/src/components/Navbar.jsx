import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { ShoppingCart, Heart, User, LogOut, Home, Package, BarChart3, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import storeConfigService from '../services/storeConfig';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { itemsCount } = useCart();
  const { count: favoritesCount } = useFavorites();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [storeConfig, setStoreConfig] = useState({
    store_name: 'Fashion Store',
    logo_url: null,
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (user?.role === 'administrador') return '/admin/dashboard';
    if (user?.role === 'cliente') return '/cliente/perfil';
    return '/';
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
          logo_url: null,
        });
      }
    };

    loadStoreConfig();
  }, []);

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            {storeConfig.logo_url || storeConfig.logo ? (
              <img 
                src={storeConfig.logo_url || storeConfig.logo} 
                alt={storeConfig.store_name}
                className="h-12 w-12 object-contain"
                onError={(e) => {
                  // Si hay error cargando la imagen, usar icono por defecto
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <Package className="h-12 w-12 text-primary-600" />
            )}
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              {storeConfig.store_name}
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 transition">
              Inicio
            </Link>
            <Link to="/productos" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 transition">
              Productos
            </Link>
            <Link to="/ofertas" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 transition">
              Ofertas
            </Link>

            {isAuthenticated ? (
              <>
                {/* Carrito */}
                {user?.role === 'cliente' && (
                  <>
                    <Link to="/carrito" className="relative">
                      <ShoppingCart className="h-6 w-6 text-gray-700 dark:text-gray-300 hover:text-primary-600 transition" />
                      {itemsCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {itemsCount}
                        </span>
                      )}
                    </Link>
                    
                    {/* Favoritos */}
                    <Link to="/cliente/favoritos" className="relative">
                      <Heart className="h-6 w-6 text-gray-700 dark:text-gray-300 hover:text-red-500 transition" />
                      {favoritesCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {favoritesCount}
                        </span>
                      )}
                    </Link>
                  </>
                )}

                {/* Dashboard/Perfil */}
                <Link 
                  to={getDashboardLink()} 
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 transition cursor-pointer"
                  title={user?.role === 'administrador' ? 'Panel de Administración' : 'Mi Perfil'}
                >
                  {user?.role === 'administrador' && <BarChart3 className="h-5 w-5" />}
                  {user?.role === 'cliente' && <User className="h-5 w-5" />}
                  <span className="font-medium">
                    {user?.role === 'administrador' ? user?.username : `Mi Perfil (${user?.username})`}
                  </span>
                </Link>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Salir</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 transition">
                  Iniciar Sesión
                </Link>
                <Link to="/register" className="btn-primary">
                  Registrarse
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-700 dark:text-gray-300"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-3">
            <Link to="/" className="block text-gray-700 dark:text-gray-300 hover:text-primary-600">
              Inicio
            </Link>
            <Link to="/productos" className="block text-gray-700 dark:text-gray-300 hover:text-primary-600">
              Productos
            </Link>
            <Link to="/ofertas" className="block text-gray-700 dark:text-gray-300 hover:text-primary-600">
              Ofertas
            </Link>

            {isAuthenticated ? (
              <>
                {user?.role === 'cliente' && (
                  <>
                    <Link to="/carrito" className="block text-gray-700 dark:text-gray-300 hover:text-primary-600">
                      Carrito ({itemsCount})
                    </Link>
                    <Link to="/cliente/favoritos" className="block text-gray-700 dark:text-gray-300 hover:text-red-500">
                      Favoritos ({favoritesCount})
                    </Link>
                  </>
                )}
                <Link 
                  to={getDashboardLink()} 
                  className="block text-gray-700 dark:text-gray-300 hover:text-primary-600 font-medium"
                >
                  {user?.role === 'administrador' ? `Panel Admin (${user?.username})` : `Mi Perfil (${user?.username})`}
                </Link>
                <button onClick={handleLogout} className="block w-full text-left text-red-600 hover:text-red-700">
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block text-gray-700 dark:text-gray-300 hover:text-primary-600">
                  Iniciar Sesión
                </Link>
                <Link to="/register" className="block btn-primary text-center">
                  Registrarse
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;