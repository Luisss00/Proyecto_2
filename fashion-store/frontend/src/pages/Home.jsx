import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService, categoryService } from '../services/api';
import ProductCard from '../components/ProductCard';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Tag, TrendingUp, Package, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { isAuthenticated, isCliente } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        productService.getFeatured(),
        categoryService.getAll(),
      ]);
      
      // ✅ Validar que sean arrays
      setFeaturedProducts(Array.isArray(productsData) ? productsData : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Error al cargar los productos');
      // ✅ Establecer arrays vacíos en caso de error
      setFeaturedProducts([]);
      setCategories([]);
    } finally {
      setLoading(false);
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

    if (!product.available_sizes || product.available_sizes.length === 0) {
      toast.error('Este producto no tiene tallas disponibles');
      return;
    }

    try {
      await addItem(product, product.available_sizes[0], '', 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Bienvenido a Fashion Store
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Las mejores tendencias en moda al mejor precio
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/productos" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                Ver Productos
              </Link>
              <Link to="/ofertas" className="bg-transparent border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition">
                Ver Ofertas
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Productos Destacados */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-primary-600" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Productos Destacados
              </h2>
            </div>
            <Link to="/productos" className="text-primary-600 hover:text-primary-700 flex items-center gap-2">
              Ver más <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {featuredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No hay productos destacados disponibles
              </p>
              <Link to="/productos" className="btn-primary mt-4 inline-block">
                Ver Todos los Productos
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categorías */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Categorías
            </h2>
            <Link to="/productos" className="text-primary-600 hover:text-primary-700 flex items-center gap-2">
              Ver todas <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* ✅ Validación agregada aquí */}
          {categories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {categories.slice(0, 5).map((category) => (
                <Link
                  key={category.id}
                  to={`/productos?categoria=${category.slug}`}
                  className="card hover:shadow-xl transition-all group"
                >
                  <div className="flex flex-col items-center p-4">
                    <div className="bg-primary-100 dark:bg-primary-900 p-4 rounded-full mb-3 group-hover:bg-primary-600 transition">
                      <Package className="h-8 w-8 text-primary-600 dark:text-primary-400 group-hover:text-white" />
                    </div>
                    <h3 className="font-semibold text-center text-gray-900 dark:text-white">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1">
                      {category.products_count} productos
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No hay categorías disponibles
              </p>
            </div>
          )}
        </div>
      </section>

      

      {/* Banner de Ofertas */}
      <section className="py-16 bg-gradient-to-r from-red-500 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Tag className="h-16 w-16 mx-auto mb-4" />
          <h2 className="text-4xl font-bold mb-4">
            ¡Ofertas Especiales!
          </h2>
          <p className="text-xl mb-8">
            Hasta 50% de descuento en productos seleccionados
          </p>
          <Link to="/ofertas" className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-block">
            Ver Ofertas
          </Link>
        </div>
      </section>

      {/* Call to Action */}
      {!isAuthenticated && (
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              ¿Listo para empezar?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Crea tu cuenta y disfruta de todos los beneficios
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/register" className="btn-primary">
                Registrarse Ahora
              </Link>
              <Link to="/login" className="btn-secondary">
                Iniciar Sesión
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;