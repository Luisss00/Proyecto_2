import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingBag,
  BarChart3,
  Settings,
  Home,
} from 'lucide-react';

const Sidebar = ({ isOpen }) => {
  const location = useLocation();

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin/dashboard',
    },
    {
      title: 'Productos',
      icon: Package,
      path: '/admin/productos',
    },
    {
      title: 'Usuarios',
      icon: Users,
      path: '/admin/usuarios',
    },
    {
      title: 'Pedidos',
      icon: ShoppingBag,
      path: '/admin/pedidos',
    },
    {
      title: 'Reportes',
      icon: BarChart3,
      path: '/admin/reportes',
    },
    {
      title: 'Configuración',
      icon: Settings,
      path: '/admin/configuracion',
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-gray-800 shadow-lg z-40 transition-transform duration-300 overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <nav className="p-4 space-y-2">
          {/* Volver a la tienda */}
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          >
            <Home className="h-5 w-5" />
            <span className="font-medium">Volver a la Tienda</span>
          </Link>

          <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

          {/* Menu Items */}
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive(item.path)
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;