import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Páginas públicas
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Offers from './pages/Offers';

// Páginas de cliente
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ClientProfile from './pages/Profile';
import ClientOrders from './pages/Orders';

// Páginas de vendedor - Comentado porque no existen las carpetas
// import VendorProducts from './pages/vendor/Products';
// import VendorProductForm from './pages/vendor/ProductForm';

// Páginas de admin - Comentado porque no existen las carpetas
// import AdminDashboard from './pages/admin/Dashboard';
// import AdminUsers from './pages/admin/Users';
// import AdminOrders from './pages/admin/Orders';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Rutas públicas */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/productos" element={<Products />} />
                <Route path="/producto/:id" element={<ProductDetail />} />
                <Route path="/ofertas" element={<Offers />} />

                {/* Rutas de cliente */}
                <Route
                  path="/carrito"
                  element={
                    <ProtectedRoute allowedRoles={['cliente']}>
                      <Cart />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute allowedRoles={['cliente']}>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/cliente/perfil"
                  element={
                    <ProtectedRoute allowedRoles={['cliente']}>
                      <ClientProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/cliente/pedidos"
                  element={
                    <ProtectedRoute allowedRoles={['cliente']}>
                      <ClientOrders />
                    </ProtectedRoute>
                  }
                />

                {/* Rutas de vendedor - Comentado porque no existen los componentes
                <Route
                  path="/vendedor/productos"
                  element={
                    <ProtectedRoute allowedRoles={['vendedor']}>
                      <VendorProducts />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/vendedor/producto/nuevo"
                  element={
                    <ProtectedRoute allowedRoles={['vendedor']}>
                      <VendorProductForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/vendedor/producto/editar/:id"
                  element={
                    <ProtectedRoute allowedRoles={['vendedor']}>
                      <VendorProductForm />
                    </ProtectedRoute>
                  }
                />
                */}

                {/* Rutas de administrador - Comentado porque no existen los componentes
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['administrador']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/usuarios"
                  element={
                    <ProtectedRoute allowedRoles={['administrador']}>
                      <AdminUsers />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/pedidos"
                  element={
                    <ProtectedRoute allowedRoles={['administrador']}>
                      <AdminOrders />
                    </ProtectedRoute>
                  }
                />
                */}

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

// Componente 404
const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
        Página no encontrada
      </p>
      <a href="/" className="btn-primary">
        Volver al Inicio
      </a>
    </div>
  </div>
);

export default App;