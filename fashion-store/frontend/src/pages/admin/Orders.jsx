import { useState, useEffect } from 'react';
import { orderService } from '../../services/api';
import { Search, Eye, Package, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getAll();
      setOrders(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Error al cargar pedidos');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updateStatus(orderId, newStatus);
      toast.success('Estado actualizado');
      fetchOrders();
    } catch (error) {
      toast.error('Error al actualizar estado');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pendiente: { bg: 'bg-yellow-100 text-yellow-800', icon: Clock },
      confirmado: { bg: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      enviado: { bg: 'bg-purple-100 text-purple-800', icon: Truck },
      entregado: { bg: 'bg-green-100 text-green-800', icon: CheckCircle },
      cancelado: { bg: 'bg-red-100 text-red-800', icon: XCircle },
    };
    return badges[status] || badges.pendiente;
  };

  const formatPrice = (price) => {
    // Validar y sanitizar el precio
    const numPrice = Number(price);
    
    // Si es NaN, null, undefined o no es un número válido, devolver $0
    if (isNaN(numPrice) || numPrice === null || numPrice === undefined) {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
      }).format(0);
    }
    
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(numPrice);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.order_number?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? order.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const openOrderDetails = async (order) => {
    try {
      setLoading(true);
      const detailedOrder = await orderService.getById(order.id);
      setSelectedOrder(detailedOrder);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Error al cargar detalles del pedido');
      // Fallback: usar los datos básicos si falla la carga completa
      setSelectedOrder(order);
      setShowModal(true);
    } finally {
      setLoading(false);
    }
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
          <h1 className="text-3xl font-bold">Gestión de Pedidos</h1>
          <p className="text-gray-600 mt-1">{filteredOrders.length} pedidos</p>
        </div>

        <a
          href="http://localhost:8000/admin/orders/order/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
        >
          Django Admin
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Pendientes</p>
              <p className="text-2xl font-bold">
                {orders.filter(o => o.status === 'pendiente').length}
              </p>
            </div>
            <Clock className="h-10 w-10 text-yellow-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Confirmados</p>
              <p className="text-2xl font-bold">
                {orders.filter(o => o.status === 'confirmado').length}
              </p>
            </div>
            <CheckCircle className="h-10 w-10 text-blue-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">En Envío</p>
              <p className="text-2xl font-bold">
                {orders.filter(o => o.status === 'enviado').length}
              </p>
            </div>
            <Truck className="h-10 w-10 text-purple-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Entregados</p>
              <p className="text-2xl font-bold">
                {orders.filter(o => o.status === 'entregado').length}
              </p>
            </div>
            <CheckCircle className="h-10 w-10 text-green-200" />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por número de orden..."
              className="input-field pl-10 w-full"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field"
          >
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="confirmado">Confirmado</option>
            <option value="enviado">Enviado</option>
            <option value="entregado">Entregado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orden</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                  No se encontraron pedidos
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => {
                const StatusIcon = getStatusBadge(order.status).icon;
                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Package className="h-5 w-5 text-gray-400 mr-2" />
                        <div className="text-sm font-medium">{order.order_number}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{order.user?.username || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm font-bold">{formatPrice(order.total)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(order.status).bg}`}>
                        <StatusIcon className="h-3 w-3" />
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('es-CO')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openOrderDetails(order)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="confirmado">Confirmado</option>
                          <option value="enviado">Enviado</option>
                          <option value="entregado">Entregado</option>
                          <option value="cancelado">Cancelado</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        loading && selectedOrder === null ? (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-8">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                <span className="ml-4 text-lg">Cargando detalles del pedido...</span>
              </div>
            </div>
          </div>
        ) : selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Detalles del Pedido</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Número de Orden</p>
                    <p className="font-semibold">{selectedOrder.order_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fecha</p>
                    <p className="font-semibold">
                      {new Date(selectedOrder.created_at).toLocaleDateString('es-CO')}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">Información de Envío</h3>
                  <p className="text-sm text-gray-600">{selectedOrder.shipping_address || 'No especificada'}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.shipping_city || 'No especificada'}</p>
                  <p className="text-sm text-gray-600">Tel: {selectedOrder.shipping_phone || 'No especificado'}</p>
                  <p className="text-sm text-gray-600">Método de pago: {selectedOrder.payment_method || 'No especificado'}</p>
                  <p className="text-sm text-gray-600">Estado: {selectedOrder.status || 'No especificado'}</p>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">Productos</h3>
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    <div className="space-y-2">
                      {selectedOrder.items.map((item) => (
                        <div key={item.id} className="flex justify-between p-2 bg-gray-50 rounded">
                          <div>
                            <p className="font-medium">{item.product?.name || 'Producto eliminado'}</p>
                            <p className="text-sm text-gray-600">
                              {item.size && `Talla: ${item.size} | `}Cantidad: {item.quantity || 1}
                              {item.color && ` | Color: ${item.color}`}
                            </p>
                            {item.price && (
                              <p className="text-sm text-gray-600">
                                Precio unitario: {formatPrice(item.price)}
                              </p>
                            )}
                          </div>
                          <p className="font-semibold">{formatPrice(item.subtotal)}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No hay productos en este pedido</p>
                  )}
                </div>

                <div className="border-t pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>{formatPrice(selectedOrder.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Envío</span>
                      <span>{formatPrice(selectedOrder.shipping_cost)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>IVA</span>
                      <span>{formatPrice(selectedOrder.tax)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold border-t pt-2">
                      <span>Total</span>
                      <span>{formatPrice(selectedOrder.total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button onClick={() => setShowModal(false)} className="btn-secondary">
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
        )
      )}
    </div>
  );
};

export default AdminOrders;
