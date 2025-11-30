import { useCart } from '../contexts/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import ProductImage from '../components/ProductImage';

const Cart = () => {
  const { cart, updateItem, removeItem, loading } = useCart();
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    try {
      await updateItem(itemId, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await removeItem(itemId);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!cart || cart.items?.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="h-24 w-24 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Tu carrito está vacío
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Agrega productos para comenzar a comprar
          </p>
          <Link to="/productos" className="btn-primary inline-block">
            Ver Productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Carrito de Compras
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Items del carrito */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div key={item.id} className="card">
                {/* Layout responsivo: imagen y contenido */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Imagen con diseño responsivo */}
                  <div className="flex-shrink-0 mx-auto sm:mx-0">
                    <ProductImage
                      src={item.product.primary_image}
                      alt={item.product.name}
                      size="lg"
                      className="w-full sm:w-24 sm:h-24 h-48 sm:h-auto"
                    />
                  </div>

                  {/* Información del producto */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      {/* Info básica */}
                      <div className="flex-1">
                        <Link
                          to={`/producto/${item.product.id}`}
                          className="font-semibold text-gray-900 dark:text-white hover:text-primary-600 text-lg sm:text-base line-clamp-2"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Talla: <span className="font-medium">{item.size}</span>
                          {item.color && (
                            <>
                              {' | '}
                              Color: <span className="font-medium">{item.color}</span>
                            </>
                          )}
                        </p>
                        <p className="text-lg font-bold text-primary-600 mt-2 sm:mt-1">
                          {formatPrice(item.product.final_price)}
                        </p>
                      </div>

                      {/* Controles y totales */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4 sm:gap-2">
                        {/* Eliminar botón - móvil y desktop */}
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors sm:p-0"
                          title="Eliminar del carrito"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>

                        {/* Controles de cantidad */}
                        <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-lg p-1">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="font-semibold w-8 text-center min-w-[2rem]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded transition-colors"
                            disabled={item.quantity >= item.product.stock}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Subtotal */}
                        <p className="font-bold text-gray-900 dark:text-white text-lg sm:text-base min-w-[6rem] text-right">
                          {formatPrice(item.subtotal)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Resumen del Pedido
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal ({cart.items_count} items)</span>
                  <span>{formatPrice(cart.total)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Envío</span>
                  <span>{formatPrice(15000)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>IVA (19%)</span>
                  <span>{formatPrice(cart.total * 0.19)}</span>
                </div>
                <div className="border-t border-gray-300 dark:border-gray-600 pt-3">
                  <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span>{formatPrice(cart.total + 15000 + (cart.total * 0.19))}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                Proceder al Pago
                <ArrowRight className="h-5 w-5" />
              </button>

              <Link
                to="/productos"
                className="block text-center text-primary-600 hover:text-primary-700 mt-4"
              >
                Continuar Comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;