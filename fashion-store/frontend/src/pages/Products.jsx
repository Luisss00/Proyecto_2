import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService, categoryService } from '../services/api';
import ProductCard from '../components/ProductCard';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Search, Filter, X } from 'lucide-react';
import { toast } from 'react-toastify';

// Helper function to safely parse JSON arrays
const safeParseArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('');
  const { addItem } = useCart();
  const { isAuthenticated, isCliente } = useAuth();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]); // Fallback a array vacío
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      
      if (searchParams.get('search')) {
        params.search = searchParams.get('search');
      }
      
      if (searchParams.get('categoria')) {
        params.category = searchParams.get('categoria');
      }

      if (searchParams.get('ordering')) {
        params.ordering = searchParams.get('ordering');
      }

      const data = await productService.getAll(params);
      const products = Array.isArray(data) ? data : data.results || [];
      
      // Apply safeParseArray to all products to ensure available_sizes is always an array
      const processedProducts = products.map(product => ({
        ...product,
        available_sizes: safeParseArray(product.available_sizes),
        colors: safeParseArray(product.colors),
      }));
      
      setProducts(processedProducts);
      console.log('Products loaded:', processedProducts.length);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Error al cargar los productos: ' + (error.message || 'Error desconocido'));
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      searchParams.set('search', searchTerm);
    } else {
      searchParams.delete('search');
    }
    setSearchParams(searchParams);
  };

  const handleCategoryChange = (categorySlug) => {
    setSelectedCategory(categorySlug);
    if (categorySlug) {
      searchParams.set('categoria', categorySlug);
    } else {
      searchParams.delete('categoria');
    }
    setSearchParams(searchParams);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    if (sort) {
      searchParams.set('ordering', sort);
    } else {
      searchParams.delete('ordering');
    }
    setSearchParams(searchParams);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSortBy('');
    setSearchParams({});
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
      await addItem(product, product.available_sizes[0], '', 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Productos
          </h1>

          {/* Buscador */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar productos..."
                className="input-field pl-10 pr-4"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    searchParams.delete('search');
                    setSearchParams(searchParams);
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </form>

          {/* Filtros */}
          <div className="flex flex-wrap gap-4 items-center">
            {/* Categoría */}
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="input-field w-auto"
            >
              <option value="">Todas las categorías</option>
              {(categories || []).map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Ordenar */}
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="input-field w-auto"
            >
              <option value="">Ordenar por</option>
              <option value="price">Precio: Menor a Mayor</option>
              <option value="-price">Precio: Mayor a Menor</option>
              <option value="-created_at">Más Recientes</option>
              <option value="-views_count">Más Populares</option>
            </select>

            {/* Limpiar filtros */}
            {(searchParams.toString()) && (
              <button
                onClick={clearFilters}
                className="btn-secondary flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Limpiar Filtros
              </button>
            )}
          </div>
        </div>

        {/* Productos */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <Filter className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No se encontraron productos
            </p>
          </div>
        ) : (
          <>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {products.length} producto(s) encontrado(s)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Products;