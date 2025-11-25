import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Layouts
import AdminLayout from './components/admin/AdminLayout';

// Páginas públicas
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Offers from './pages/Offers';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';

// Páginas de admin
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminUsers from './pages/admin/Users';
import AdminOrders from './pages/admin/Orders';
import AdminReports from './pages/admin/Reports';
import AdminSettings from './pages/admin/Settings';
import ProductForm from './components/admin/ProductForm';

// Páginas de cliente
import ClienteLayout from './components/cliente/ClienteLayout';
import OptimizedClienteProfile from './pages/cliente/OptimizedProfile';
import ClienteOrders from './pages/cliente/Orders';
import ClienteFavorites from './pages/cliente/Favorites';
import ClienteAddresses from './pages/cliente/Addresses';
import ClienteSettings from './pages/cliente/Settings';


function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* ==================== RUTAS PÚBLICAS ==================== */}
            <Route
              path="/*"
              element={
                <div className="flex flex-col min-h-screen">
                  <Navbar />
                  <main className="flex-grow">
                    <Routes>
                      {/* Páginas principales */}
                      <Route path="/" element={<Home />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/productos" element={<Products />} />
                      <Route path="/producto/:id" element={<ProductDetail />} />
                      <Route path="/ofertas" element={<Offers />} />

                      {/* Rutas protegidas para clientes */}
                      <Route
                        path="/carrito"
                        element={
                          <ProtectedRoute allowedRoles={['cliente', 'administrador']}>
                            <Cart />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/checkout"
                        element={
                          <ProtectedRoute allowedRoles={['cliente', 'administrador']}>
                            <Checkout />
                          </ProtectedRoute>
                        }
                      />

                      {/* 404 */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              }
            />

            {/* ==================== RUTAS DE ADMINISTRADOR ==================== */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRoles={['administrador']}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="productos" element={<AdminProducts />} />
              <Route path="productos/create" element={<ProductForm />} />
              <Route path="productos/edit/:id" element={<ProductForm />} />
              <Route path="usuarios" element={<AdminUsers />} />
              <Route path="pedidos" element={<AdminOrders />} />
              <Route path="reportes" element={<AdminReports />} />
              <Route path="configuracion" element={<AdminSettings />} />
            </Route>

            {/* ==================== RUTAS DE CLIENTE ==================== */}
            <Route
              path="/cliente/*"
              element={
                <ProtectedRoute allowedRoles={['cliente', 'administrador']}>
                  <ClienteLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/cliente/perfil" replace />} />
              <Route path="perfil" element={<OptimizedClienteProfile />} />
              <Route path="pedidos" element={<ClienteOrders />} />
              <Route path="favoritos" element={<ClienteFavorites />} />
              <Route path="direcciones" element={<ClienteAddresses />} />
              <Route path="configuracion" element={<ClienteSettings />} />
          </Route>
          </Routes>

          {/* Toast Notifications */}
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

// ==================== COMPONENTE 404 ====================
const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
    <div className="text-center">
      <h1 className="text-9xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
      <p className="text-2xl text-gray-600 dark:text-gray-400 mb-8">
        Página no encontrada
      </p>
      <p className="text-gray-500 dark:text-gray-500 mb-8">
        La página que buscas no existe o fue movida.
      </p>
      <a href="/" className="btn-primary inline-flex items-center gap-2">
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
        Volver al Inicio
      </a>
    </div>
  </div>
);

export default App;