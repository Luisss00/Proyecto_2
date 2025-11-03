import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productService } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { ShoppingCart, Star, Package, ArrowLeft, Minus, Plus } from 'lucide-react';
import { toast } from 'react-toastify';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem } = useCart();
  const { isAuthenticated, isCliente } = useAuth();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await productService.getById(id);
      setProduct(data);
      if (data.available_sizes?.length > 0) {
        setSelectedSize(data.available_sizes[0]);
      }
      if (data.colors?.length > 0) {
        setSelectedColor(data.colors[0]);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Error al cargar el producto');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.warning('Debes iniciar sesión para agregar productos al carrito');
      return;
    }

    if (!isCliente) {
      toast.warning('Solo los clientes pueden agregar productos al carrito');
      return;
    }

    if (!selectedSize) {
      toast.error('Por favor selecciona una talla');
      return;
    }

    try {
      await addItem(product, selectedSize, selectedColor, quantity);
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Producto no encontrado</p>
          <Link to="/productos" className="btn-primary mt-4 inline-block">
            Ver Productos
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images?.length > 0 
    ? product.images 
    : [{ image: 'https://via.placeholder.com/600x800?text=No+Image' }];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link to="/productos" className="text-primary-600 hover:text-primary-700 flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver a productos
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Imágenes */}
          <div>
            {/* Imagen principal */}
            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden mb-4">
              <img
                src={images[selectedImage]?.image || images[0]?.image}
                alt={product.name}
                className="w-full h-[500px] object-cover"
              />
            </div>

            {/* Miniaturas */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`border-2 rounded-lg overflow-hidden ${
                      selectedImage === index 
                        ? 'border-primary-600' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <img
                      src={img.image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-24 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Información */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Categoría: <strong>{product.category?.name}</strong>
              </span>
              {product.average_rating > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="font-semibold">{product.average_rating.toFixed(1)}</span>
                  <span className="text-gray-600 dark:text-gray-400">
                    ({product.reviews_count} reseñas)
                  </span>
                </div>
              )}
            </div>

            {/* Precio */}
            <div className="mb-6">
              {product.has_discount ? (
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-primary-600">
                    {formatPrice(product.discount_price)}
                  </span>
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="bg-red-500 text-white px-2 py-1 rounded-md text-sm font-bold">
                    -{Math.round(((product.price - product.discount_price) / product.price) * 100)}%
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Descripción */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Descripción
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {product.description}
              </p>
            </div>

            {/* Tallas */}
            {product.available_sizes?.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Talla
                </h3>
                <div className="flex gap-2">
                  {product.available_sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border-2 rounded-lg font-semibold transition ${
                        selectedSize === size
                          ? 'border-primary-600 bg-primary-600 text-white'
                          : 'border-gray-300 dark:border-gray-600 hover:border-primary-600'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colores */}
            {product.colors?.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Color
                </h3>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border-2 rounded-lg transition ${
                        selectedColor === color
                          ? 'border-primary-600 bg-primary-600 text-white'
                          : 'border-gray-300 dark:border-gray-600 hover:border-primary-600'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Cantidad */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Cantidad
              </h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-5 w-5" />
                </button>
                <span className="text-xl font-semibold w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-5 w-5" />
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Stock disponible: {product.stock}
                </span>
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-4">
              {product.stock > 0 ? (
                <button
                  onClick={handleAddToCart}
                  className="btn-primary flex items-center gap-2 flex-1"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Agregar al Carrito
                </button>
              ) : (
                <button disabled className="btn-primary flex-1 opacity-50 cursor-not-allowed">
                  Agotado
                </button>
              )}
            </div>

            {/* Info adicional */}
            <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Vendedor:</strong> {product.vendor?.username}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                <strong>Vistas:</strong> {product.views_count}
              </p>
            </div>
          </div>
        </div>

        {/* Reseñas */}
        {product.reviews?.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Reseñas ({product.reviews_count})
            </h2>
            <div className="space-y-4">
              {product.reviews.map((review) => (
                <div key={review.id} className="card">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">
                          {review.user.username}
                        </span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">
                        {review.comment}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(review.created_at).toLocaleDateString('es-CO')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;