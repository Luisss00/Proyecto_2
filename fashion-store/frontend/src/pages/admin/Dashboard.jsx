import { useState, useEffect } from 'react';
import { orderService, userService } from '../../services/api';
import StatCard from '../../components/admin/StatCard';
import { DollarSign, ShoppingBag, Users, Package, TrendingUp } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const [ordersData, usersData] = await Promise.all([
        orderService.getStatistics(),
        userService.getStatistics().catch(() => ({ total_users: 0 })) // Fallback si falla
      ]);
      
      // Combinar datos de órdenes con datos de usuarios
      const combinedData = {
        ...ordersData,
        total_users: usersData.total_users || 0,
      };
      
      setStats(combinedData);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Resumen general de Fashion Store
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Ingresos Totales"
          value={formatPrice(stats?.total_revenue || 0)}
          icon={DollarSign}
          color="green"
          trend="up"
          trendValue="12.5%"
        />
        <StatCard
          title="Total Pedidos"
          value={stats?.total_orders || 0}
          icon={ShoppingBag}
          color="blue"
          trend="up"
          trendValue="8.2%"
        />
        <StatCard
          title="Pedidos Pendientes"
          value={stats?.pending_orders || 0}
          icon={Package}
          color="yellow"
        />
        <StatCard
          title="Usuarios Activos"
          value={stats?.total_users || 0}
          icon={Users}
          color="purple"
          trend="up"
          trendValue="5.1%"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ventas por día */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary-600" />
            Ventas Últimos 7 Días
          </h3>
          <div className="space-y-3">
            {stats?.orders_by_day && stats.orders_by_day.length > 0 ? (
              stats.orders_by_day.map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(day.date).toLocaleDateString('es-CO', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">{day.count} pedidos</span>
                    <span className="text-sm font-bold text-primary-600">
                      {formatPrice(day.revenue || 0)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No hay datos disponibles</p>
            )}
          </div>
        </div>

        {/* Productos más vendidos */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Productos Más Vendidos
          </h3>
          <div className="space-y-3">
            {stats?.top_products && stats.top_products.length > 0 ? (
              stats.top_products.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 font-bold rounded-full w-8 h-8 flex items-center justify-center">
                      {index + 1}
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {product.product__name}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {product.total_sold} vendidos
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No hay datos disponibles</p>
            )}
          </div>
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Acciones Rápidas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="btn-primary">Crear Producto</button>
          <button className="btn-secondary">Ver Pedidos Pendientes</button>
          <button className="btn-secondary">Generar Reporte</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;