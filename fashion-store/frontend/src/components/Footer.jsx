import { Link, useNavigate } from 'react-router-dom';
import { Package, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
import { useState, useEffect } from 'react';
import storeConfigService from '../services/storeConfig';
import { categoryService, productService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Footer = () => {
  const [config, setConfig] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, isAdmin, isCliente, isAuthenticated } = useAuth();

  // Función para determinar la ruta de "Mi Cuenta" según el tipo de usuario
  const getAccountRoute = () => {
    if (isAuthenticated) {
      if (isAdmin) {
        return '/admin/dashboard';
      } else if (isCliente) {
        return '/cliente/perfil';
      }
    }
    return '/login';
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        // Cargar configuración de la tienda
        const configData = await storeConfigService.getPublicConfig();
        setConfig(configData);
        
        // Cargar categorías
        const categoriesData = await categoryService.getAll();
        // Extraer solo las categorías activas y ordenar por nombre
        const activeCategories = categoriesData
          .filter(category => category.is_active)
          .sort((a, b) => a.name.localeCompare(b.name));
        setCategories(activeCategories);
      } catch (error) {
        console.error('Error al cargar datos del footer:', error);
        // Usar valores por defecto en caso de error
        setConfig({
          store_name: 'Fashion Store',
          store_email: 'info@fashionstore.com',
          store_phone: '+57 300 123 4567',
          store_address: 'Cienaga Magdalena, Colombia',
          facebook_url: 'https://facebook.com/fashionstore',
          instagram_url: 'https://instagram.com/fashionstore',
          twitter_url: 'https://twitter.com/fashionstore',
        });
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleCategoryClick = async (categoryName) => {
    try {
      // Navegar a la página de productos con la categoría como filtro
      navigate(`/productos?categoria=${categoryName}`);
      
      // Si estamos en la página de productos, hacer request AJAX para filtrar
      if (window.location.pathname === '/productos') {
        const products = await productService.getByCategory(categoryName);
        // Emitir evento personalizado para que el componente Products lo escuche
        window.dispatchEvent(new CustomEvent('filterProducts', { 
          detail: { products, categoryName } 
        }));
      }
    } catch (error) {
      console.error('Error al filtrar productos por categoría:', error);
    }
  };

  if (loading) {
    return (
      <footer className="bg-gray-900 text-gray-300 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-pulse">Cargando...</div>
          </div>
        </div>
      </footer>
    );
  }

  // Estilos dinámicos basados en la configuración
  const footerStyle = {
    backgroundColor: config?.footer_background_color || '#1F2937',
    color: config?.footer_text_color || '#D1D5DB'
  };

  const titleStyle = {
    color: config?.footer_title_color || '#FFFFFF'
  };

  return (
    <footer className="mt-20" style={footerStyle}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              {config?.logo_url || config?.logo ? (
                <img 
                  src={config.logo_url || config.logo} 
                  alt={config.store_name}
                  className="h-16 w-16 object-contain"
                  onError={(e) => {
                    // Si hay error cargando la imagen, usar icono por defecto
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <Package className="h-16 w-16 text-primary-600" />
              )}
              <span className="text-xl font-bold" style={titleStyle}>{config?.store_name || 'Fashion Store'}</span>
            </div>
            <p className="text-sm">
              Tu tienda de moda favorita. Calidad, estilo y las mejores ofertas.
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="font-semibold mb-4" style={titleStyle}>Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-primary-600 transition">Inicio</Link></li>
              <li><Link to="/productos" className="hover:text-primary-600 transition">Productos</Link></li>
              <li><Link to="/ofertas" className="hover:text-primary-600 transition">Ofertas</Link></li>
              <li><Link to={getAccountRoute()} className="hover:text-primary-600 transition">Mi Cuenta</Link></li>
            </ul>
          </div>

          {/* Categorías */}
          <div>
            <h3 className="font-semibold mb-4" style={titleStyle}>Categorías</h3>
            <ul className="space-y-2 text-sm">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <li key={category.id}>
                    <button
                      onClick={() => handleCategoryClick(category.name)}
                      className="hover:text-primary-600 transition text-left w-full"
                    >
                      {category.name}
                    </button>
                  </li>
                ))
              ) : (
                <li>
                  <span className="text-gray-500">Cargando categorías...</span>
                </li>
              )}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="font-semibold mb-4" style={titleStyle}>Contacto</h3>
            <ul className="space-y-2 text-sm">
              {config?.store_email && (
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{config.store_email}</span>
                </li>
              )}
              {config?.store_phone && (
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{config.store_phone}</span>
                </li>
              )}
              {config?.store_address && (
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{config.store_address}</span>
                </li>
              )}
            </ul>
            
            {/* Redes Sociales */}
            {(config?.facebook_url || config?.instagram_url || config?.twitter_url) && (
              <div className="mt-4">
                <h4 className="font-medium mb-3" style={titleStyle}>Síguenos</h4>
                <div className="flex space-x-3">
                  {config?.facebook_url && (
                    <a 
                      href={config.facebook_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-3 rounded-full hover:bg-opacity-10 hover:bg-white transition-all duration-300 group"
                      style={{ 
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.querySelector('svg').style.color = config?.footer_title_color || '#FFFFFF';
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.querySelector('svg').style.color = footerStyle.color;
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                      title="Síguenos en Facebook"
                    >
                      <Facebook 
                        size={22} 
                        style={{ 
                          color: footerStyle.color,
                          transition: 'color 0.3s ease'
                        }}
                      />
                    </a>
                  )}
                  {config?.instagram_url && (
                    <a 
                      href={config.instagram_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-3 rounded-full hover:bg-opacity-10 hover:bg-white transition-all duration-300 group"
                      style={{ 
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.querySelector('svg').style.color = config?.footer_title_color || '#FFFFFF';
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.querySelector('svg').style.color = footerStyle.color;
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                      title="Síguenos en Instagram"
                    >
                      <Instagram 
                        size={22} 
                        style={{ 
                          color: footerStyle.color,
                          transition: 'color 0.3s ease'
                        }}
                      />
                    </a>
                  )}
                  {config?.twitter_url && (
                    <a 
                      href={config.twitter_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-3 rounded-full hover:bg-opacity-10 hover:bg-white transition-all duration-300 group"
                      style={{ 
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.querySelector('svg').style.color = config?.footer_title_color || '#FFFFFF';
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.querySelector('svg').style.color = footerStyle.color;
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                      title="Síguenos en Twitter"
                    >
                      <Twitter 
                        size={22} 
                        style={{ 
                          color: footerStyle.color,
                          transition: 'color 0.3s ease'
                        }}
                      />
                    </a>
                  )}
                </div>
                <p className="text-xs mt-2 opacity-75">Conecta con nosotros</p>
              </div>
            )}
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
          <p>&copy; 2025 {config?.store_name || 'Fashion Store'}. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;