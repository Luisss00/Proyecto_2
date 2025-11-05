import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../services/api';
import { 
  Package, 
  DollarSign, 
  ShoppingBag, 
  AlertTriangle,
  TrendingUp,
  Plus,
  Eye,
  BarChart3
} from 'lucide-react';
import { toast } from 'react-toastify';

const VendorDashboard = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const data = await productService.getVendorStatistics();
      setStatistics(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar estadísticas');
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Bienvenido a tu panel de vendedor
          </p>
        </div>
        <Link
          to="/vendedor/productos/nuevo"
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Nuevo Producto
        </Link>
      </div>

      {/* Tarjetas de Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Productos */}
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">
                Mis Productos
              </p>
              <p className="text-3xl font-bold">
                {statistics?.total_products || 0}
              </p>
              <p className="text-blue-200 text-xs mt-2">
                {statistics?.active_products || 0} activos
              </p>
            </div>
            <div className="bg-blue-400 bg-opacity-30 p-3 rounded-lg">
              <Package className="h-10 w-10" />
            </div>
          </div>
        </div>

        {/* Ingresos Totales */}
        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium mb-1">
                Ingresos Totales
              </p>
              <p className="text-2xl font-bold">
                {formatPrice(statistics?.total_revenue || 0)}
              </p>
              <p className="text-green-200 text-xs mt-2">
                {statistics?.total_orders || 0} ventas
              </p>
            </div>
            <div className="bg-green-400 bg-opacity-30 p-3 rounded-lg">
              <DollarSign className="h-10 w-10" />
            </div>
          </div>
        </div>

        {/* Pedidos */}
        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium mb-1">
                Pedidos
              </p>
              <p className="text-3xl font-bold">
                {statistics?.total_orders || 0}
              </p>
              <p className="text-purple-200 text-xs mt-2">
                Completados
              </p>
            </div>
            <div className="bg-purple-400 bg-opacity-30 p-3 rounded-lg">
              <ShoppingBag className="h-10 w-10" />
            </div>
          </div>
        </div>

        {/* Stock Bajo */}
        <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium mb-1">
                Stock Bajo
              </p>
              <p className="text-3xl font-bold">
                {statistics?.low_stock_count || 0}
              </p>
              <p className="text-orange-200 text-xs mt-2">
                {statistics?.out_of_stock_count || 0} agotados
              </p>
            </div>
            <div className="bg-orange-400 bg-opacity-30 p-3 rounded-lg">
              <AlertTriangle className="h-10 w-10" />
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos y Tablas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productos Más Vendidos */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary-600" />
              Productos Más Vendidos
            </h2>
          </div>

          {statistics?.top_products && statistics.top_products.length > 0 ? (
            <div className="space-y-3">
              {statistics.top_products.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="bg-primary-600 text-white font-bold rounded-full w-10 h-10 flex items-center justify-center text-sm flex-shrink-0">
                      #{index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {product.product__name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {product.total_sold} unidades vendidas
                      </p>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-bold text-green-600 dark:text-green-400">
                      {formatPrice(product.revenue)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 dark:text-gray-400">
                No hay ventas registradas aún
              </p>
              <Link
                to="/vendedor/productos/nuevo"
                className="btn-primary inline-flex items-center gap-2 mt-4"
              >
                <Plus className="h-5 w-5" />
                Agregar Producto
              </Link>
            </div>
          )}
        </div>

        {/* Ventas por Mes */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-primary-600" />
              Ventas Últimos 6 Meses
            </h2>
          </div>

          {statistics?.monthly_sales && statistics.monthly_sales.length > 0 ? (
            <div className="space-y-4">
              {statistics.monthly_sales.map((month, index) => {
                const maxRevenue = Math.max(
                  ...statistics.monthly_sales.map((m) => m.revenue || 0)
                );
                const percentage =
                  maxRevenue > 0 ? ((month.revenue || 0) / maxRevenue) * 100 : 0;
                const date = new Date(month.month);
                const monthName = date.toLocaleDateString('es-CO', {
                  month: 'long',
                  year: 'numeric',
                });

                return (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-400 capitalize font-medium">
                        {monthName}
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {formatPrice(month.revenue || 0)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {month.orders} {month.orders === 1 ? 'pedido' : 'pedidos'}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 dark:text-gray-400">
                No hay datos de ventas mensuales
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/vendedor/productos/nuevo"
            className="card hover:shadow-xl transition-all border-2 border-primary-100 dark:border-primary-900 hover:border-primary-300 dark:hover:border-primary-700"
          >
            <div className="flex items-center gap-4">
              <div className="bg-primary-600 text-white p-3 rounded-lg">
                <Plus className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  Nuevo Producto
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Agregar a tu catálogo
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/vendedor/productos"
            className="card hover:shadow-xl transition-all border-2 border-orange-100 dark:border-orange-900 hover:border-orange-300 dark:hover:border-orange-700"
          >
            <div className="flex items-center gap-4">
              <div className="bg-orange-600 text-white p-3 rounded-lg">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  Stock Bajo
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {statistics?.low_stock_count || 0} productos
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/vendedor/pedidos"
            className="card hover:shadow-xl transition-all border-2 border-purple-100 dark:border-purple-900 hover:border-purple-300 dark:hover:border-purple-700"
          >
            <div className="flex items-center gap-4">
              <div className="bg-purple-600 text-white p-3 rounded-lg">
                <Eye className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  Ver Pedidos
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Gestiona tus ventas
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;