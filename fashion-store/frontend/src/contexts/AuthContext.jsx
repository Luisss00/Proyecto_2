import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('access_token');
    
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp > currentTime) {
          const profile = await authService.getProfile();
          setUser(profile);
        } else {
          logout();
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        logout();
      }
    }
    
    setLoading(false);
  };

  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials);
      
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      
      setUser(data.user);
      toast.success('¡Bienvenido!');
      
      return data.user;
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Error al iniciar sesión');
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      await authService.register(userData);
      toast.success('Registro exitoso. Por favor inicia sesión.');
    } catch (error) {
      const errorMsg = error.response?.data;
      if (typeof errorMsg === 'object') {
        Object.values(errorMsg).forEach(msg => toast.error(Array.isArray(msg) ? msg[0] : msg));
      } else {
        toast.error('Error al registrarse');
      }
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    toast.info('Sesión cerrada');
  };

  const updateUser = (updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isCliente: user?.role === 'cliente',
    isVendedor: user?.role === 'vendedor',
    isAdmin: user?.role === 'administrador',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};