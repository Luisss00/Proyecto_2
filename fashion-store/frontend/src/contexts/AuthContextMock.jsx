import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

// Mock users para desarrollo local
const MOCK_USERS = [
  {
    id: 1,
    username: 'cliente1',
    email: 'cliente1@test.com',
    password: 'Cliente123!',
    role: 'cliente',
    first_name: 'Cliente',
    last_name: 'Uno'
  },
  {
    id: 2,
    username: 'vendedor1',
    email: 'vendedor1@test.com',
    password: 'Vendedor123!',
    role: 'vendedor',
    first_name: 'Vendedor',
    last_name: 'Uno'
  },
  {
    id: 3,
    username: 'admin',
    email: 'admin@test.com',
    password: 'Admin123!',
    role: 'administrador',
    first_name: 'Admin',
    last_name: 'Sistema'
  }
];

const AuthContextMock = createContext();

export const useAuthMock = () => {
  const context = useContext(AuthContextMock);
  if (!context) {
    throw new Error('useAuthMock must be used within AuthProviderMock');
  }
  return context;
};

export const AuthProviderMock = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Verificar si hay una sesión guardada
  useEffect(() => {
    const savedUser = localStorage.getItem('mock_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    
    try {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Buscar usuario en mock data
      const mockUser = MOCK_USERS.find(
        u => u.username === credentials.username && u.password === credentials.password
      );
      
      if (!mockUser) {
        throw new Error('Credenciales inválidas');
      }
      
      // Crear objeto de usuario sin password
      const { password, ...userWithoutPassword } = mockUser;
      setUser(userWithoutPassword);
      localStorage.setItem('mock_user', JSON.stringify(userWithoutPassword));
      toast.success('¡Bienvenido!');
      
      return userWithoutPassword;
    } catch (error) {
      toast.error(error.message || 'Error al iniciar sesión');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    
    try {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Verificar si el usuario ya existe
      const existingUser = MOCK_USERS.find(u => u.username === userData.username || u.email === userData.email);
      if (existingUser) {
        throw new Error('El usuario o email ya existe');
      }
      
      // Simular registro exitoso
      toast.success('Registro exitoso. Por favor inicia sesión.');
      
      // En un caso real, aquí se crearía el usuario en la base de datos
    } catch (error) {
      toast.error(error.message || 'Error al registrarse');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('mock_user');
    setUser(null);
    toast.info('Sesión cerrada');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isCliente: user?.role === 'cliente',
    isVendedor: user?.role === 'vendedor',
    isAdmin: user?.role === 'administrador',
  };

  return <AuthContextMock.Provider value={value}>{children}</AuthContextMock.Provider>;
};