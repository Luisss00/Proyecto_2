import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService, productService, userService } from '../../services/api';
import { 
  DollarSign, 
  ShoppingBag, 
  Package, 
  Users,
  TrendingUp,
  Plus,
  FileText,
  Clock
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    activeUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Obtener estadísticas
      const ordersData = await orderService.getAll();
      const usersData = await userService.getAll();
      const productsData = await productService.getAll();

      // Calcular estadísticas
      const totalRevenue = ordersData
        .filter(order => order.status !== 'cancelado')
        .reduce((sum, order) => sum + parseFloat(order.total || 0), 0);

      const pendingOrders = ordersData.filter(
        order => order.status === 'pendiente'
      ).length;

      setStats({
        totalRevenue,
        totalOrders: ordersData.length,
        pendingOrders,
        activeUsers: usersData.filter(u => u.is_active).length,
      });

      // Obtener últimos pedidos
      setRecentOrders(ordersData.slice(0, 5));

      // Productos más vendidos (simulado)
      setTopProducts(productsData.slice(0, 5));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Resumen general de Fashion Store
        </p>
      </div>

      {/* Tarjetas de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Ingresos Totales */}
        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm mb-1">Ingresos Totales</p>
              <p className="text-3xl font-bold">{formatPrice(stats.totalRevenue)}</p>
              <p className="text-green-100 text-xs mt-1">↑ 12.5% vs mes anterior</p>
            </div>
            <div className="bg-green-400 bg-opacity-30 p-4 rounded-full">
              <DollarSign className="h-8 w-8" />
            </div>
          </div>
        </div>

        {/* Total Pedidos */}
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm mb-1">Total Pedidos</p>
              <p className="text-3xl font-bold">{stats.totalOrders}</p>
              <p className="text-blue-100 text-xs mt-1">↑ 8.2% vs mes anterior</p>
            </div>
            <div className="bg-blue-400 bg-opacity-30 p-4 rounded-full">
              <ShoppingBag className="h-8 w-8" />
            </div>
          </div>
        </div>

        {/* Pedidos Pendientes */}
        <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm mb-1">Pedidos Pendientes</p>
              <p className="text-3xl font-bold">{stats.pendingOrders}</p>
              <p className="text-yellow-100 text-xs mt-1">Requieren atención</p>
            </div>
            <div className="bg-yellow-400 bg-opacity-30 p-4 rounded-full">
              <Package className="h-8 w-8" />
            </div>
          </div>
        </div>

        {/* Usuarios Activos */}
        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm mb-1">Usuarios Activos</p>
              <p className="text-3xl font-bold">{stats.activeUsers}</p>
              <p className="text-purple-100 text-xs mt-1">↑ 5.1% vs mes anterior</p>
            </div>
            <div className="bg-purple-400 bg-opacity-30 p-4 rounded-full">
              <Users className="h-8 w-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ventas Últimos 7 Días */}
        <div className="card">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-5 w-5 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Ventas Últimos 7 Días
            </h2>
          </div>
          <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            No hay datos disponibles
          </div>
        </div>

        {/* Productos Más Vendidos */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Productos Más Vendidos
          </h2>
          {topProducts.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
              No hay datos disponibles
            </div>
          ) : (
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full text-primary-600 dark:text-primary-400 font-bold text-sm">
                    {index + 1}
                  </div>
                  <img
                    src={product.primary_image || 'https://via.placeholder.com/50'}
                    alt={product.name}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {product.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Crear Producto */}
          <Link
            to="/admin/productos/create"
            className="flex items-center justify-center gap-3 p-6 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-xl transition-colors group"
          >
            <div className="bg-primary-600 p-3 rounded-lg group-hover:scale-110 transition-transform">
              <Plus className="h-6 w-6 text-white" />
            </div>
            <span className="font-semibold text-primary-600 dark:text-primary-400">
              Crear Producto
            </span>
          </Link>

          {/* Ver Pedidos Pendientes */}
          <Link
            to="/admin/pedidos?status=pendiente"
            className="flex items-center justify-center gap-3 p-6 bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded-xl transition-colors group"
          >
            <div className="bg-yellow-600 p-3 rounded-lg group-hover:scale-110 transition-transform">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <span className="font-semibold text-yellow-600 dark:text-yellow-400">
              Ver Pedidos Pendientes
            </span>
          </Link>

          {/* Generar Reporte */}
          <Link
            to="/admin/reportes"
            className="flex items-center justify-center gap-3 p-6 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-xl transition-colors group"
          >
            <div className="bg-purple-600 p-3 rounded-lg group-hover:scale-110 transition-transform">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <span className="font-semibold text-purple-600 dark:text-purple-400">
              Generar Reporte
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;