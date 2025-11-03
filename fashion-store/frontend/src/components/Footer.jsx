import { Link } from 'react-router-dom';
import { Package, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Package className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-white">Fashion Store</span>
            </div>
            <p className="text-sm">
              Tu tienda de moda favorita. Calidad, estilo y las mejores ofertas.
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="text-white font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-primary-600 transition">Inicio</Link></li>
              <li><Link to="/productos" className="hover:text-primary-600 transition">Productos</Link></li>
              <li><Link to="/ofertas" className="hover:text-primary-600 transition">Ofertas</Link></li>
              <li><Link to="/login" className="hover:text-primary-600 transition">Mi Cuenta</Link></li>
            </ul>
          </div>

          {/* Categorías */}
          <div>
            <h3 className="text-white font-semibold mb-4">Categorías</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/productos?categoria=camisetas" className="hover:text-primary-600 transition">Camisetas</Link></li>
              <li><Link to="/productos?categoria=pantalones" className="hover:text-primary-600 transition">Pantalones</Link></li>
              <li><Link to="/productos?categoria=vestidos" className="hover:text-primary-600 transition">Vestidos</Link></li>
              <li><Link to="/productos?categoria=zapatos" className="hover:text-primary-600 transition">Zapatos</Link></li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>info@fashionstore.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+57 300 123 4567</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Cienaga Magdalena, Colombia</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2024 Fashion Store. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;