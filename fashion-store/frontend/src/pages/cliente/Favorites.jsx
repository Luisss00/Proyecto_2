import { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Eye, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

const ClienteFavorites = () => {
  const { favorites, loading, removeFromFavorites, refreshFavorites } = useFavorites();
  const { addItem } = useCart();
  const { isAuthenticated, isCliente } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      refreshFavorites();
    }
  }, [isAuthenticated]);

  const handleRemoveFavorite = async (favoriteId) => {
    try {
      await removeFromFavorites(favoriteId);
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      toast.warning('Debes iniciar sesión para agregar productos al carrito');
      return;
    }

    if (!isCliente) {
      toast.warning('Solo los clientes pueden agregar productos al carrito');
      return;
    }

    try {
      await addItem(product, product.available_sizes?.[0] || 'M', '', 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
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
      <div className="flex justify-center py-12">
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
              Mis Favoritos
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {favorites.length} {favorites.length === 1 ? 'producto guardado' : 'productos guardados'}
            </p>
          </div>
          <div className="bg-red-100 dark:bg-red-900 p-3 rounded-full">
            <Heart className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
        </div>
      </div>

      {/* Lista de Favoritos */}
      {favorites.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center">
          <Heart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No tienes favoritos
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Guarda productos que te gusten para verlos después
          </p>
          <a href="/productos" className="btn-primary inline-flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Explorar Productos
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((favorite) => {
            const product = favorite.product;
            return (
              <div
                key={favorite.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-300"
              >
                {/* Imagen */}
                <div className="relative overflow-hidden">
                  <img
                    src={product.primary_image || 'https://via.placeholder.com/300'}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <button
                    onClick={() => handleRemoveFavorite(favorite.id)}
                    className="absolute top-2 right-2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                    title="Eliminar de favoritos"
                  >
                    <Heart className="h-5 w-5 text-red-600 fill-current" />
                  </button>
                </div>

                {/* Contenido */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {product.category_name}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatPrice(product.final_price || product.price)}
                    </span>
                    {product.has_discount && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>

                  {/* Acciones */}
                  <div className="flex gap-2 pt-2">
                    <Link
                      to={`/producto/${product.id}`}
                      className="btn-secondary flex-1 flex items-center justify-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      Ver
                    </Link>
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="btn-primary flex-1 flex items-center justify-center gap-2 hover:scale-105 transition-transform duration-200"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ClienteFavorites;