import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../../services/api';
import { AlertCircle, Edit, Package } from 'lucide-react';
import { toast } from 'react-toastify';

const VendorLowStock = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLowStockProducts();
  }, []);

  const fetchLowStockProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getLowStock();
      setProducts(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      console.error('Error fetching low stock products:', error);
      toast.error('Error al cargar productos con stock bajo');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStockClass = (stock) => {
    if (stock === 0) return 'text-red-600 bg-red-100 dark:bg-red-900/20';
    if (stock <= 3) return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
    return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
  };

  const getStockMessage = (stock) => {
    if (stock === 0) return '¡Agotado!';
    if (stock <= 3) return 'Stock crítico';
    return 'Stock bajo';
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Productos con Stock Bajo
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {products.length} productos requieren atención
        </p>
      </div>

      {/* Alerta */}
      {products.length > 0 && (
        <div className="card bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">
                Productos con stock bajo detectados
              </h3>
              <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
                Los siguientes productos tienen 5 unidades o menos en stock.
                Considera reabastecer pronto para evitar quedarte sin inventario.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tarjetas de productos */}
      {products.length === 0 ? (
        <div className="card">
          <div className="flex flex-col items-center justify-center py-12">
            <Package className="h-24 w-24 text-green-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              ¡Excelente!
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center">
              Todos tus productos tienen stock adecuado.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="card hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative">
                <img
                  src={product.primary_image || '/placeholder-image.png'}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-sm font-medium ${getStockClass(product.stock)}`}>
                  {getStockMessage(product.stock)}
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {product.name}
              </h3>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Categoría:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {product.category_name}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Precio:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatPrice(product.final_price)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Stock actual:</span>
                  <span className={`text-lg font-bold ${
                    product.stock === 0
                      ? 'text-red-600'
                      : product.stock <= 3
                      ? 'text-orange-600'
                      : 'text-yellow-600'
                  }`}>
                    {product.stock} unidades
                  </span>
                </div>

                {product.stock === 0 && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span className="font-medium">No puedes vender este producto</span>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <button
                  onClick={() => navigate(`/vendedor/productos/${product.id}/edit`)}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Actualizar Stock
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tip */}
      <div className="card bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          💡 <strong>Recomendación:</strong> Mantén un stock mínimo de 10 unidades de tus productos más vendidos.
          Esto te ayudará a evitar perder ventas por falta de inventario. Puedes ver tus productos más vendidos
          en la sección de estadísticas.
        </p>
      </div>
    </div>
  );
};

export default VendorLowStock;
