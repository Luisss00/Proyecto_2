import { useState, useEffect } from 'react';
import { orderService } from '../../services/api';
import { TrendingUp, DollarSign, ShoppingBag, Package, Download } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminReports = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const data = await orderService.getStatistics();
      setStats(data);
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Reportes y Estadísticas</h1>
          <p className="text-gray-600 mt-1">Análisis del rendimiento</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Download className="h-5 w-5" />
          Exportar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Ingresos Totales</p>
              <p className="text-2xl font-bold">{formatPrice(stats?.total_revenue || 0)}</p>
              <p className="text-green-200 text-xs mt-1">+12.5% vs anterior</p>
            </div>
            <DollarSign className="h-12 w-12 text-green-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Pedidos</p>
              <p className="text-2xl font-bold">{stats?.total_orders || 0}</p>
              <p className="text-blue-200 text-xs mt-1">+8.2% vs anterior</p>
            </div>
            <ShoppingBag className="h-12 w-12 text-blue-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Ticket Promedio</p>
              <p className="text-2xl font-bold">
                {formatPrice(stats?.total_orders > 0 ? stats.total_revenue / stats.total_orders : 0)}
              </p>
              <p className="text-purple-200 text-xs mt-1">+3.7% vs anterior</p>
            </div>
            <TrendingUp className="h-12 w-12 text-purple-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Productos Vendidos</p>
              <p className="text-2xl font-bold">
                {stats?.top_products?.reduce((sum, p) => sum + p.total_sold, 0) || 0}
              </p>
              <p className="text-orange-200 text-xs mt-1">+15.3% vs anterior</p>
            </div>
            <Package className="h-12 w-12 text-orange-200" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-6">Ventas Últimos 7 Días</h3>
          <div className="space-y-4">
            {stats?.orders_by_day && stats.orders_by_day.length > 0 ? (
              stats.orders_by_day.map((day, index) => {
                const maxRevenue = Math.max(...stats.orders_by_day.map(d => d.revenue || 0));
                const percentage = maxRevenue > 0 ? ((day.revenue || 0) / maxRevenue) * 100 : 0;
                return (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">
                        {new Date(day.date).toLocaleDateString('es-CO', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short'
                        })}
                      </span>
                      <span className="font-semibold">{formatPrice(day.revenue || 0)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-center py-8">No hay datos disponibles</p>
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-6">Top 5 Productos</h3>
          <div className="space-y-4">
            {stats?.top_products && stats.top_products.length > 0 ? (
              stats.top_products.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary-600 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{product.product__name}</p>
                      <p className="text-sm text-gray-600">{product.total_sold} vendidos</p>
                    </div>
                  </div>
                  <Package className="h-6 w-6 text-gray-400" />
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No hay datos disponibles</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;