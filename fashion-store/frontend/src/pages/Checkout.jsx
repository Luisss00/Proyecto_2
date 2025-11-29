import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { orderService } from '../services/api';
import { CreditCard, MapPin, Phone, FileText } from 'lucide-react';
import { toast } from 'react-toastify';

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shipping_address: '',
    shipping_city: '',
    shipping_phone: '',
    payment_method: 'contra_entrega',
    notes: '',
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Preparar datos con los items del carrito
      const orderData = {
        ...formData,
        items: cart.items.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          size: item.size,
          color: item.color || ''
        }))
      };
      
      const order = await orderService.create(orderData);
      
      toast.success('¡Pedido realizado con éxito!');
      await clearCart();
      navigate(`/cliente/pedidos`);
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error(error.response?.data?.error || 'Error al procesar el pedido');
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.items?.length === 0) {
    navigate('/carrito');
    return null;
  }

  const subtotal = cart.total;
  const shipping = 15000;
  const tax = subtotal * 0.19;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Finalizar Compra
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información de Envío */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary-600" />
                Información de Envío
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Dirección Completa *
                  </label>
                  <input
                    type="text"
                    name="shipping_address"
                    required
                    value={formData.shipping_address}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Calle 123 #45-67, Apto 890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Ciudad *
                  </label>
                  <input
                    type="text"
                    name="shipping_city"
                    required
                    value={formData.shipping_city}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Medellín, Antioquia"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Teléfono de Contacto *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      name="shipping_phone"
                      required
                      value={formData.shipping_phone}
                      onChange={handleChange}
                      className="input-field pl-10"
                      placeholder="+57 300 123 4567"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Método de Pago */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary-600" />
                Método de Pago
              </h2>

              <div className="space-y-3">
                <label className="flex items-center p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary-600 transition">
                  <input
                    type="radio"
                    name="payment_method"
                    value="contra_entrega"
                    checked={formData.payment_method === 'contra_entrega'}
                    onChange={handleChange}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Contra Entrega
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Paga cuando recibas tu pedido
                    </p>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary-600 transition opacity-50">
                  <input
                    type="radio"
                    name="payment_method"
                    value="nequi"
                    disabled
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Nequi
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Próximamente disponible
                    </p>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary-600 transition opacity-50">
                  <input
                    type="radio"
                    name="payment_method"
                    value="stripe"
                    disabled
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Tarjeta de Crédito/Débito
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Próximamente disponible
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Notas Adicionales */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary-600" />
                Notas Adicionales (Opcional)
              </h2>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="input-field"
                rows="3"
                placeholder="Instrucciones especiales de entrega..."
              ></textarea>
            </div>
          </div>

          {/* Resumen del Pedido */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Resumen del Pedido
              </h2>

              {/* Productos */}
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.product.primary_image || 'https://via.placeholder.com/60'}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1 text-sm">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {item.product.name}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        Talla: {item.size} | x{item.quantity}
                      </p>
                      <p className="font-semibold text-primary-600">
                        {formatPrice(item.subtotal)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totales */}
              <div className="border-t border-gray-300 dark:border-gray-600 pt-4 space-y-2">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Envío</span>
                  <span>{formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>IVA (19%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="border-t border-gray-300 dark:border-gray-600 pt-2">
                  <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              {/* Botón */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary mt-6"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Procesando...
                  </div>
                ) : (
                  'Confirmar Pedido'
                )}
              </button>

              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                Al confirmar tu pedido, aceptas nuestros términos y condiciones
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;