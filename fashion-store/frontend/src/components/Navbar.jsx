import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { ShoppingCart, User, LogOut, Home, Package, BarChart3, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { itemsCount } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (user?.role === 'administrador') return '/admin/dashboard';
    if (user?.role === 'vendedor') return '/vendedor/productos';
    return '/cliente/perfil';
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Package className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Fashion Store
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
                  <Link to="/carrito" className="relative">
                    <ShoppingCart className="h-6 w-6 text-gray-700 dark:text-gray-300 hover:text-primary-600 transition" />
                    {itemsCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {itemsCount}
                      </span>
                    )}
                  </Link>
                )}

                {/* Dashboard */}
                <Link 
                  to={getDashboardLink()} 
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 transition"
                >
                  {user?.role === 'administrador' && <BarChart3 className="h-5 w-5" />}
                  {user?.role === 'vendedor' && <Package className="h-5 w-5" />}
                  {user?.role === 'cliente' && <User className="h-5 w-5" />}
                  <span>{user?.username}</span>
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
                  <Link to="/carrito" className="block text-gray-700 dark:text-gray-300 hover:text-primary-600">
                    Carrito ({itemsCount})
                  </Link>
                )}
                <Link to={getDashboardLink()} className="block text-gray-700 dark:text-gray-300 hover:text-primary-600">
                  Mi Panel
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