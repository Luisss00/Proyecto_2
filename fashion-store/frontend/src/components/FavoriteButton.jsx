import { Heart } from 'lucide-react';
import { useFavorites } from '../contexts/FavoritesContext';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import { toast } from 'react-toastify';

const FavoriteButton = ({ productId, className = '', size = 'default', showTooltip = true }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isAuthenticated, isCliente } = useAuth();
  const [isToggling, setIsToggling] = useState(false);
  
  // Si no está autenticado o no es cliente, no mostrar el botón
  if (!isAuthenticated || !isCliente) {
    return null;
  }
  
  const isProductFavorite = isFavorite(productId);
  const sizeClasses = {
    small: 'h-4 w-4',
    default: 'h-5 w-5',
    large: 'h-6 w-6'
  };

  const buttonSize = sizeClasses[size] || sizeClasses.default;

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      setIsToggling(true);
      await toggleFavorite(productId);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={isToggling}
      className={`
        ${className}
        ${isToggling ? 'animate-pulse' : ''}
        hover:scale-110 transition-all duration-200
        ${isProductFavorite 
          ? 'text-red-500 hover:text-red-600' 
          : 'text-gray-400 hover:text-red-500'
        }
        ${isToggling ? 'opacity-50' : 'opacity-100'}
      `}
      title={isProductFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
    >
      <Heart 
        className={`
          ${buttonSize}
          ${isProductFavorite ? 'fill-current' : ''}
          transition-all duration-200
        `} 
      />
      {isToggling && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
        </div>
      )}
    </button>
  );
};

export default FavoriteButton;