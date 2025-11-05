import { useState, useEffect } from 'react';
import { productService } from '../../services/api';
import { TrendingUp, DollarSign, Package, ShoppingBag, Calendar } from 'lucide-react';
import { toast } from 'react-toastify';

const VendorStatistics = () => {
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

  // Calcular ticket promedio
  const averageTicket = statistics?.total_orders > 0 
    ? statistics.total_revenue / statistics.total_orders 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Estadísticas de Ventas
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Análisis detallado de tu desempeño
        </p>
      </div>

      {/* Resumen General */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium mb-1">
                Ingresos Totales
              </p>
              <p className="text-2xl font-bold">
                {formatPrice(statistics?.total_revenue || 0)}
              </p>
              <p className="text-green-200 text-xs mt-2">Ventas completadas</p>
            </div>
            <div className="bg-green-400 bg-opacity-30 p-3 rounded-lg">
              <DollarSign className="h-10 w-10" />
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">
                Total Ventas
              </p>
              <p className="text-3xl font-bold">
                {statistics?.total_orders || 0}
              </p>
              <p className="text-blue-200 text-xs mt-2">Pedidos entregados</p>
            </div>
            <div className="bg-blue-400 bg-opacity-30 p-3 rounded-lg">
              <ShoppingBag className="h-10 w-10" />
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium mb-1">
                Ticket Promedio
              </p>
              <p className="text-2xl font-bold">
                {formatPrice(averageTicket)}
              </p>
              <p className="text-purple-200 text-xs mt-2">Por venta</p>
            </div>
            <div className="bg-purple-400 bg-opacity-30 p-3 rounded-lg">
              <TrendingUp className="h-10 w-10" />
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium mb-1">
                Productos Activos
              </p>
              <p className="text-3xl font-bold">
                {statistics?.active_products || 0}
              </p>
              <p className="text-orange-200 text-xs mt-2">
                De {statistics?.total_products || 0} totales
              </p>
            </div>
            <div className="bg-orange-400 bg-opacity-30 p-3 rounded-lg">
              <Package className="h-10 w-10" />
            </div>
          </div>
        </div>
      </div>

      {/* Ventas Mensuales */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary-100 dark:bg-primary-900 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Evolución de Ventas
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Últimos 6 meses
              </p>
            </div>
          </div>
        </div>

        {statistics?.monthly_sales && statistics.monthly_sales.length > 0 ? (
          <div className="space-y-6">
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
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                      {monthName}
                    </span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {month.orders} {month.orders === 1 ? 'pedido' : 'pedidos'}
                      </span>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {formatPrice(month.revenue || 0)}
                      </span>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-primary-500 to-primary-600 h-4 rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-2"
                        style={{ width: `${percentage}%` }}
                      >
                        <span className="text-xs font-bold text-white">
                          {percentage.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 dark:text-gray-400">
              No hay datos de ventas mensuales
            </p>
          </div>
        )}
      </div>

      {/* Top Productos */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Productos Más Vendidos
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Top 5 productos
              </p>
            </div>
          </div>
        </div>

        {statistics?.top_products && statistics.top_products.length > 0 ? (
          <div className="space-y-4">
            {statistics.top_products.map((product, index) => {
              const maxSold = Math.max(
                ...statistics.top_products.map((p) => p.total_sold)
              );
              const percentage = maxSold > 0 ? (product.total_sold / maxSold) * 100 : 0;

              return (
                <div
                  key={index}
                  className="p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="bg-gradient-to-br from-primary-500 to-primary-600 text-white font-bold rounded-full w-12 h-12 flex items-center justify-center text-lg shadow-lg">
                        #{index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white text-lg truncate">
                          {product.product__name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {product.total_sold} unidades vendidas
                        </p>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {formatPrice(product.revenue)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Ingresos
                      </p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 dark:text-gray-400">
              No hay productos vendidos aún
            </p>
          </div>
        )}
      </div>

      {/* Alertas de Stock */}
      {(statistics?.low_stock_count > 0 || statistics?.out_of_stock_count > 0) && (
        <div className="card bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-200 dark:border-orange-800">
          <div className="flex items-start gap-4">
            <div className="bg-orange-500 text-white p-3 rounded-lg">
              <Package className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-lg">
                ⚠️ Alertas de Inventario
              </h3>
              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                {statistics.low_stock_count > 0 && (
                  <p>
                    • <strong>{statistics.low_stock_count}</strong> productos con stock bajo
                    (≤5 unidades)
                  </p>
                )}
                {statistics.out_of_stock_count > 0 && (
                  <p className="text-red-600 dark:text-red-400 font-medium">
                    • <strong>{statistics.out_of_stock_count}</strong> productos agotados
                  </p>
                )}
              </div>

              {/* ✅ Enlace corregido */}
              <a
                href="/vendedor/productos"
                className="inline-block mt-3 text-orange-600 dark:text-orange-400 font-medium hover:underline"
              >
                Ver productos →
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorStatistics;
