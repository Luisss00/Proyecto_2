import { createContext, useContext, useState, useEffect } from 'react';
import { favoritesService } from '../services/api';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites();
      fetchCount();
    } else {
      // Si no está autenticado, limpiar favoritos
      setFavorites([]);
      setCount(0);
    }
  }, [isAuthenticated]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const data = await favoritesService.getAll();
      setFavorites(data.results || data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCount = async () => {
    try {
      const data = await favoritesService.getCount();
      setCount(data.count || 0);
    } catch (error) {
      console.error('Error fetching favorites count:', error);
    }
  };

  const addToFavorites = async (productId) => {
    try {
      const response = await favoritesService.add(productId);
      await fetchFavorites();
      await fetchCount();
      toast.success('Producto agregado a favoritos');
      return { success: true, isFavorite: true, ...response };
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al agregar a favoritos');
      throw error;
    }
  };

  const removeFromFavorites = async (favoriteId) => {
    try {
      const response = await favoritesService.remove(favoriteId);
      await fetchFavorites();
      await fetchCount();
      toast.success('Producto eliminado de favoritos');
      return { success: true, isFavorite: false, ...response };
    } catch (error) {
      toast.error('Error al eliminar de favoritos');
      throw error;
    }
  };

  const toggleFavorite = async (productId) => {
    try {
      const response = await favoritesService.toggle(productId);
      await fetchFavorites();
      await fetchCount();
      
      if (response.is_favorite) {
        toast.success('Producto agregado a favoritos');
      } else {
        toast.success('Producto eliminado de favoritos');
      }
      
      return response;
    } catch (error) {
      toast.error('Error al actualizar favoritos');
      throw error;
    }
  };

  const checkFavorite = async (productId) => {
    try {
      const response = await favoritesService.checkFavorite(productId);
      return response.is_favorite;
    } catch (error) {
      console.error('Error checking favorite status:', error);
      return false;
    }
  };

  const isFavorite = (productId) => {
    // Asegurar que favorites sea un array antes de usar .some()
    if (!Array.isArray(favorites)) {
      return false;
    }
    return favorites.some(fav => fav?.product?.id === productId);
  };

  const value = {
    favorites,
    loading,
    count,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    checkFavorite,
    isFavorite,
    refreshFavorites: fetchFavorites,
  };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};