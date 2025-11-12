import { useState, useEffect } from 'react';
import { orderService } from '../../services/api';
import { Package, Clock, CheckCircle, XCircle, Truck, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'react-toastify';

const ClienteOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getMyOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Error al cargar pedidos');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    const statuses = {
      pendiente: { 
        bg: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', 
        icon: Clock,
        label: 'Pendiente',
        color: 'text-yellow-600'
      },
      confirmado: { 
        bg: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', 
        icon: CheckCircle,
        label: 'Confirmado',
        color: 'text-blue-600'
      },
      enviado: { 
        bg: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200', 
        icon: Truck,
        label: 'En camino',
        color: 'text-purple-600'
      },
      entregado: { 
        bg: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', 
        icon: CheckCircle,
        label: 'Entregado',
        color: 'text-green-600'
      },
      cancelado: { 
        bg: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', 
        icon: XCircle,
        label: 'Cancelado',
        color: 'text-red-600'
      },
    };
    return statuses[status] || statuses.pendiente;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
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
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Mis Pedidos
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {orders.length} {orders.length === 1 ? 'pedido realizado' : 'pedidos realizados'}
            </p>
          </div>
          <div className="bg-primary-100 dark:bg-primary-900 p-3 rounded-full">
            <Package className="h-8 w-8 text-primary-600 dark:text-primary-400" />
          </div>
        </div>
      </div>

      {/* Estadísticas Rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['pendiente', 'confirmado', 'enviado', 'entregado'].map((status) => {
          const count = orders.filter((o) => o.status === status).length;
          const info = getStatusInfo(status);
          const StatusIcon = info.icon;
          return (
            <div key={status} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
              <div className="flex items-center gap-3">
                <StatusIcon className={`h-8 w-8 ${info.color}`} />
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{count}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{info.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lista de Pedidos */}
      {orders.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center">
          <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No tienes pedidos
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Cuando realices compras, aparecerán aquí
          </p>
          <a href="/productos" className="btn-primary inline-flex items-center gap-2">
            <Package className="h-5 w-5" />
            Explorar Productos
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            const StatusIcon = statusInfo.icon;
            const isExpanded = expandedOrder === order.id;

            return (
              <div
                key={order.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
              >
                {/* Header del Pedido */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary-100 dark:bg-primary-900 p-3 rounded-lg">
                        <Package className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-lg">
                          Pedido #{order.order_number}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(order.created_at).toLocaleDateString('es-CO', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${statusInfo.bg}`}
                    >
                      <StatusIcon className="h-4 w-4" />
                      {statusInfo.label}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {order.items?.length || 0} {order.items?.length === 1 ? 'producto' : 'productos'}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {formatPrice(order.total)}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleOrderDetails(order.id)}
                      className="btn-secondary flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      {isExpanded ? 'Ocultar' : 'Ver'} Detalles
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Detalles Expandidos */}
                {isExpanded && (
                  <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-900">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      {/* Información de Envío */}
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                          <Truck className="h-5 w-5 text-primary-600" />
                          Información de Envío
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p className="text-gray-600 dark:text-gray-400">
                            <strong>Dirección:</strong> {order.shipping_address}
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">
                            <strong>Ciudad:</strong> {order.shipping_city}
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">
                            <strong>Teléfono:</strong> {order.shipping_phone}
                          </p>
                        </div>
                      </div>

                      {/* Resumen de Pago */}
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                          Resumen de Pago
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between text-gray-600 dark:text-gray-400">
                            <span>Subtotal:</span>
                            <span>{formatPrice(order.subtotal)}</span>
                          </div>
                          <div className="flex justify-between text-gray-600 dark:text-gray-400">
                            <span>Envío:</span>
                            <span>{formatPrice(order.shipping_cost)}</span>
                          </div>
                          <div className="flex justify-between text-gray-600 dark:text-gray-400">
                            <span>IVA:</span>
                            <span>{formatPrice(order.tax)}</span>
                          </div>
                          <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                            <span>Total:</span>
                            <span>{formatPrice(order.total)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Productos */}
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Productos
                      </h4>
                      <div className="space-y-3">
                        {order.items?.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg"
                          >
                            <img
                              src={item.product?.primary_image || 'https://via.placeholder.com/80'}
                              alt={item.product?.name}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 dark:text-white">
                                {item.product?.name}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Talla: {item.size} | Cantidad: {item.quantity}
                              </p>
                            </div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {formatPrice(item.subtotal || item.price * item.quantity)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Acciones */}
                    {order.status === 'pendiente' && (
                      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <button className="btn-secondary text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                          <XCircle className="h-4 w-4 mr-2" />
                          Cancelar Pedido
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ClienteOrders;