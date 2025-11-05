import { useState, useEffect } from 'react';
import { productService } from '../../services/api';
import { Package, DollarSign, TrendingUp, ShoppingBag } from 'lucide-react';
import { toast } from 'react-toastify';

const VendorStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await productService.getVendorStatistics();
      setStats(data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
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

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">No hay datos disponibles</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Estadísticas de Ventas
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Resumen del rendimiento de tus productos
        </p>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Productos</p>
              <p className="text-3xl font-bold">{stats.total_products || 0}</p>
              <p className="text-blue-100 text-xs mt-1">
                {stats.active_products || 0} activos
              </p>
            </div>
            <Package className="h-16 w-16 text-blue-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Ingresos Totales</p>
              <p className="text-3xl font-bold">
                {formatPrice(stats.total_revenue || 0)}
              </p>
              <p className="text-green-100 text-xs mt-1">Ventas acumuladas</p>
            </div>
            <DollarSign className="h-16 w-16 text-green-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Ventas</p>
              <p className="text-3xl font-bold">{stats.total_sales || 0}</p>
              <p className="text-purple-100 text-xs mt-1">Unidades vendidas</p>
            </div>
            <TrendingUp className="h-16 w-16 text-purple-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Pedidos</p>
              <p className="text-3xl font-bold">{stats.total_orders || 0}</p>
              <p className="text-orange-100 text-xs mt-1">Con tus productos</p>
            </div>
            <ShoppingBag className="h-16 w-16 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Estadísticas adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Precio Promedio
          </h3>
          <p className="text-3xl font-bold text-primary-600">
            {formatPrice(stats.average_price || 0)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            De tus productos
          </p>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Stock Total
          </h3>
          <p className="text-3xl font-bold text-primary-600">
            {stats.total_stock || 0}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Unidades disponibles
          </p>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Stock Bajo
          </h3>
          <p className="text-3xl font-bold text-yellow-600">
            {stats.low_stock_count || 0}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Productos con stock {'<='} 5
          </p>
        </div>
      </div>

      {/* Productos más vendidos */}
      {stats.top_selling_products && stats.top_selling_products.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Productos Más Vendidos
          </h3>
          <div className="space-y-4">
            {stats.top_selling_products.map((product, index) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {product.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 dark:text-white">
                    {product.total_sold} vendidos
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatPrice(product.total_revenue)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Estado de productos */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Estado de Productos
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  Productos Activos
                </p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {stats.active_products || 0}
                </p>
              </div>
              <Package className="h-12 w-12 text-green-500" />
            </div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Productos Inactivos
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {(stats.total_products || 0) - (stats.active_products || 0)}
                </p>
              </div>
              <Package className="h-12 w-12 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Tip */}
      <div className="card bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          💡 <strong>Tip:</strong> Mantén tus productos actualizados y con buen stock para maximizar tus ventas.
          Los productos con stock bajo aparecen en la sección correspondiente del panel.
        </p>
      </div>
    </div>
  );
};

export default VendorStats;
