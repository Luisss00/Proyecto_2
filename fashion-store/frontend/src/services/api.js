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
    
    // Si es FormData, dejar que axios establezca el Content-Type automáticamente
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
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
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ==================== AUTH SERVICES ====================
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
  
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },
};

// ==================== PRODUCT SERVICES ====================
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
  
  getLatest: async () => {
    const response = await api.get('/products/products/latest/');
    return response.data;
  },
  
  create: async (data) => {
    const response = await api.post('/products/products/', data);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await api.patch(`/products/products/${id}/`, data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/products/products/${id}/`);
    return response.data;
  },
  
  getMyProducts: async () => {
    const response = await api.get('/products/products/my_products/');
    return response.data;
  },
  
  addReview: async (productId, reviewData) => {
    const response = await api.post(`/products/products/${productId}/add_review/`, reviewData);
    return response.data;
  },

  getVendorStatistics: async () => {
    const response = await api.get('/products/products/vendor_statistics/');
    return response.data;
  },
  
<<<<<<< HEAD
  getMyProducts: async () => {
    const response = await api.get('/products/products/my_products/');
    return response.data;
  },

=======
>>>>>>> b319bae63bfe01da1914287b0f5f359cb0a76b9e
  getLowStock: async () => {
    const response = await api.get('/products/products/low_stock/');
    return response.data;
  },

   getVendorStatistics: async () => {
    const response = await api.get('/products/products/vendor_statistics/');
    return response.data;
  },
};

// ==================== CATEGORY SERVICES ====================
export const categoryService = {
  getAll: async () => {
    const response = await api.get('/products/categories/');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/products/categories/${id}/`);
    return response.data;
  },
  
  getBySlug: async (slug) => {
    const response = await api.get(`/products/categories/${slug}/`);
    return response.data;
  },
};

// ==================== CART SERVICES ====================
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
    const response = await api.delete('/cart/remove_item/', { 
      data: { cart_item_id: cartItemId } 
    });
    return response.data;
  },
  
  clear: async () => {
    const response = await api.delete('/cart/clear/');
    return response.data;
  },
};

// ==================== ORDER SERVICES ====================
export const orderService = {
  getAll: async (params = {}) => {
    const response = await api.get('/orders/', { params });
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
    const response = await api.patch(`/orders/${orderId}/update_status/`, { status });
    return response.data;
  },
  
  cancel: async (orderId) => {
    const response = await api.post(`/orders/${orderId}/cancel/`);
    return response.data;
  },
  
  getStatistics: async () => {
    const response = await api.get('/orders/statistics/');
    return response.data;
  },
  
  getMyOrders: async () => {
    const response = await api.get('/orders/my_orders/');
    return response.data;
  },

  getVendorOrders: async () => {
    const response = await api.get('/orders/vendor_orders/');
    return response.data;
  },
<<<<<<< HEAD

  getVendorOrders: async () => {
    const response = await api.get('/orders/vendor_orders/');
    return response.data;
  },
=======
>>>>>>> b319bae63bfe01da1914287b0f5f359cb0a76b9e
};

// ==================== USER SERVICES ====================
export const userService = {
  getAll: async (params = {}) => {
    const response = await api.get('/users/', { params });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/users/${id}/`);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await api.patch(`/users/${id}/`, data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/users/${id}/`);
    return response.data;
  },
  
  changePassword: async (data) => {
    const response = await api.post('/users/change_password/', data);
    return response.data;
  },
};

export default api;

