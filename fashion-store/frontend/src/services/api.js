import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para refrescar token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(`${API_URL}/auth/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        localStorage.setItem('access_token', access);

        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login/', credentials);
    return response.data;
  },
  
  register: async (userData) => {
    const response = await api.post('/auth/register/', userData);
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/users/profile/');
    return response.data;
  },
  
  updateProfile: async (data) => {
    const response = await api.patch('/users/profile/', data);
    return response.data;
  },
};

// Product Services
export const productService = {
  getAll: async (params = {}) => {
    const response = await api.get('/products/products/', { params });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/products/products/${id}/`);
    return response.data;
  },
  
  getFeatured: async () => {
    const response = await api.get('/products/products/featured/');
    return response.data;
  },
  
  getOffers: async () => {
    const response = await api.get('/products/products/offers/');
    return response.data;
  },
  
  create: async (data) => {
    // Si es FormData, no establecer headers manualmente
    if (data instanceof FormData) {
      const response = await api.post('/products/products/', data);
      return response.data;
    } else {
      const response = await api.post('/products/products/', data);
      return response.data;
    }
  },
  
  update: async (id, data) => {
    // Si es FormData, no establecer headers manualmente
    if (data instanceof FormData) {
      const response = await api.patch(`/products/products/${id}/`, data);
      return response.data;
    } else {
      const response = await api.patch(`/products/products/${id}/`, data);
      return response.data;
    }
  },
  
  delete: async (id) => {
    const response = await api.delete(`/products/products/${id}/`);
    return response.data;
  },
  
  getMyProducts: async () => {
    const response = await api.get('/products/products/my_products/');
    return response.data;
  },
};

// Category Services
export const categoryService = {
  getAll: async () => {
    const response = await api.get('/products/categories/');
    return response.data;
  },
};

// Cart Services
export const cartService = {
  get: async () => {
    const response = await api.get('/cart/');
    return response.data;
  },
  
  addItem: async (data) => {
    const response = await api.post('/cart/add_item/', data);
    return response.data;
  },
  
  updateItem: async (data) => {
    const response = await api.patch('/cart/update_item/', data);
    return response.data;
  },
  
  removeItem: async (cartItemId) => {
    const response = await api.delete('/cart/remove_item/', { data: { cart_item_id: cartItemId } });
    return response.data;
  },
  
  clear: async () => {
    const response = await api.delete('/cart/clear/');
    return response.data;
  },
};

// Order Services
export const orderService = {
  getAll: async () => {
    const response = await api.get('/orders/');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/orders/${id}/`);
    return response.data;
  },
  
  create: async (data) => {
    const response = await api.post('/orders/', data);
    return response.data;
  },
  
  updateStatus: async (orderId, status) => {
    const response = await api.post(`/orders/${orderId}/update_status/`, { status });
    return response.data;
  },
  
  getStatistics: async () => {
    const response = await api.get('/orders/statistics/');
    return response.data;
  },
};

export default api;