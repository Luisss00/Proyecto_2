import { Link } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import FavoriteButton from './FavoriteButton';

const ProductCard = ({ product, onAddToCart }) => {
  const { isCliente } = useAuth();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="product-card group">
      {/* Image */}
      <div className="relative overflow-hidden h-64 bg-gray-200">
        <img
          src={product.primary_image || 'https://via.placeholder.com/400x500?text=No+Image'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        
        {product.has_discount && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-bold">
            -{Math.round(((product.price - product.discount_price) / product.price) * 100)}%
          </div>
        )}

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Agotado</span>
          </div>
        )}

        {/* Overlay con botones */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
          <Link
            to={`/producto/${product.id}`}
            className="bg-white p-2 rounded-full hover:bg-primary-600 hover:text-white transition"
          >
            <Eye className="h-5 w-5" />
          </Link>
          
          <FavoriteButton 
            productId={product.id}
            className="bg-white p-2 rounded-full hover:bg-primary-600 hover:text-white transition"
            size="default"
          />
          
          {isCliente && product.stock > 0 && (
            <button
              onClick={() => onAddToCart(product)}
              className="bg-white p-2 rounded-full hover:bg-primary-600 hover:text-white transition"
            >
              <ShoppingCart className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <Link to={`/producto/${product.id}`}>
          <h3 className="font-semibold text-gray-900 dark:text-white hover:text-primary-600 transition truncate">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {product.category_name}
        </p>

        <div className="mt-2 flex items-center justify-between">
          <div>
            {product.has_discount ? (
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-primary-600">
                  {formatPrice(product.discount_price)}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.price)}
                </span>
              </div>
            ) : (
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {product.stock > 0 && (
            <span className="text-xs text-gray-500">
              Stock: {product.stock}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;