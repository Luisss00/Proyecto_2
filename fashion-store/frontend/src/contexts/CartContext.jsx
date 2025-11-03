import { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../services/api';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await cartService.get();
      setCart(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (product, size, color = '', quantity = 1) => {
    try {
      const data = await cartService.addItem({
        product_id: product.id,
        size,
        color,
        quantity,
      });
      setCart(data);
      toast.success('Producto agregado al carrito');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al agregar producto');
      throw error;
    }
  };

  const updateItem = async (cartItemId, quantity) => {
    try {
      const data = await cartService.updateItem({ cart_item_id: cartItemId, quantity });
      setCart(data);
    } catch (error) {
      toast.error('Error al actualizar cantidad');
      throw error;
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      const data = await cartService.removeItem(cartItemId);
      setCart(data);
      toast.success('Producto eliminado');
    } catch (error) {
      toast.error('Error al eliminar producto');
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      const data = await cartService.clear();
      setCart(data);
      toast.success('Carrito vaciado');
    } catch (error) {
      toast.error('Error al vaciar carrito');
      throw error;
    }
  };

  const value = {
    cart,
    loading,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    refreshCart: fetchCart,
    itemsCount: cart?.items_count || 0,
    total: cart?.total || 0,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};