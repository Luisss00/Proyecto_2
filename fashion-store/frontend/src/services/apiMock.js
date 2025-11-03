import { toast } from 'react-toastify';

// Mock data para productos
const MOCK_PRODUCTS = [
  {
    id: 1,
    name: 'Camiseta Básica',
    description: 'Camiseta de algodón 100% natural',
    price: 29900,
    original_price: 39900,
    image: 'https://via.placeholder.com/300x300?text=Camiseta+Básica',
    category: { id: 1, name: 'Camisetas' },
    stock: 10,
    featured: true,
    is_offer: true,
  },
  {
    id: 2,
    name: 'Jeans Clásicos',
    description: 'Jeans de corte clásico, 100% algodón',
    price: 89900,
    original_price: 109900,
    image: 'https://via.placeholder.com/300x300?text=Jeans+Clásicos',
    category: { id: 2, name: 'Pantalones' },
    stock: 5,
    featured: true,
    is_offer: false,
  },
  {
    id: 3,
    name: 'Zapatos Deportivos',
    description: 'Zapatos cómodos para deporte y casual',
    price: 149900,
    original_price: 199900,
    image: 'https://via.placeholder.com/300x300?text=Zapatos+Deportivos',
    category: { id: 3, name: 'Calzado' },
    stock: 8,
    featured: true,
    is_offer: true,
  },
];

const MOCK_CATEGORIES = [
  { id: 1, name: 'Camisetas' },
  { id: 2, name: 'Pantalones' },
  { id: 3, name: 'Calzado' },
  { id: 4, name: 'Accesorios' },
];

const MOCK_ORDERS = [
  {
    id: 1,
    status: 'delivered',
    total: 150000,
    created_at: '2025-10-15T10:00:00Z',
    items: [
      { product: { name: 'Camiseta Básica' }, quantity: 1, subtotal: 29900 },
      { product: { name: 'Jeans Clásicos' }, quantity: 1, subtotal: 89900 },
    ],
    shipping_address: 'Calle 123, Bogotá, Colombia'
  },
  {
    id: 2,
    status: 'pending',
    total: 29900,
    created_at: '2025-10-20T15:30:00Z',
    items: [
      { product: { name: 'Camiseta Básica' }, quantity: 1, subtotal: 29900 },
    ],
    shipping_address: 'Calle 123, Bogotá, Colombia'
  }
];

const MOCK_CART = {
  items: [
    {
      id: 1,
      product: MOCK_PRODUCTS[0],
      quantity: 2,
      subtotal: 59800,
    }
  ],
  total: 59800,
  item_count: 2,
};

// Simular delay de red
const simulateDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Auth Services (mock)
export const authService = {
  login: async (credentials) => {
    await simulateDelay();
    // Esta función será reemplazada por el AuthContext mock
    throw new Error('Use AuthContext mock instead');
  },
  
  register: async (userData) => {
    await simulateDelay();
    // Esta función será reemplazada por el AuthContext mock
    throw new Error('Use AuthContext mock instead');
  },
  
  getProfile: async () => {
    await simulateDelay();
    const user = localStorage.getItem('mock_user');
    if (!user) throw new Error('No authenticated user');
    return JSON.parse(user);
  },
  
  updateProfile: async (data) => {
    await simulateDelay();
    const user = JSON.parse(localStorage.getItem('mock_user') || '{}');
    const updatedUser = { ...user, ...data };
    localStorage.setItem('mock_user', JSON.stringify(updatedUser));
    return updatedUser;
  },
};

// Product Services (mock)
export const productService = {
  getAll: async (params = {}) => {
    await simulateDelay();
    return {
      results: MOCK_PRODUCTS,
      count: MOCK_PRODUCTS.length,
      next: null,
      previous: null,
    };
  },
  
  getById: async (id) => {
    await simulateDelay();
    const product = MOCK_PRODUCTS.find(p => p.id === parseInt(id));
    if (!product) throw new Error('Producto no encontrado');
    return product;
  },
  
  getFeatured: async () => {
    await simulateDelay();
    return MOCK_PRODUCTS.filter(p => p.featured);
  },
  
  getOffers: async () => {
    await simulateDelay();
    return MOCK_PRODUCTS.filter(p => p.is_offer);
  },
  
  create: async (data) => {
    await simulateDelay();
    // En un caso real, esto crearía un producto
    toast.success('Producto creado exitosamente');
    return { id: Date.now(), ...data };
  },
  
  update: async (id, data) => {
    await simulateDelay();
    toast.success('Producto actualizado exitosamente');
    return { id, ...data };
  },
  
  delete: async (id) => {
    await simulateDelay();
    toast.success('Producto eliminado exitosfully');
    return { success: true };
  },
  
  getMyProducts: async () => {
    await simulateDelay();
    return []; // Usuario mock no tiene productos
  },
};

// Category Services (mock)
export const categoryService = {
  getAll: async () => {
    await simulateDelay();
    return MOCK_CATEGORIES;
  },
};

// Cart Services (mock)
export const cartService = {
  get: async () => {
    await simulateDelay();
    return MOCK_CART;
  },
  
  addItem: async (data) => {
    await simulateDelay();
    toast.success('Producto agregado al carrito');
    return MOCK_CART;
  },
  
  updateItem: async (data) => {
    await simulateDelay();
    return MOCK_CART;
  },
  
  removeItem: async (cartItemId) => {
    await simulateDelay();
    toast.success('Producto eliminado del carrito');
    return MOCK_CART;
  },
  
  clear: async () => {
    await simulateDelay();
    toast.success('Carrito limpiado');
    return { items: [], total: 0, item_count: 0 };
  },
};

// Order Services (mock)
export const orderService = {
  getAll: async () => {
    await simulateDelay();
    return MOCK_ORDERS;
  },
  
  getById: async (id) => {
    await simulateDelay();
    const order = MOCK_ORDERS.find(o => o.id === parseInt(id));
    if (!order) throw new Error('Pedido no encontrado');
    return order;
  },
  
  create: async (data) => {
    await simulateDelay(1000);
    const newOrder = {
      id: Date.now(),
      ...data,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    toast.success('Pedido creado exitosamente');
    return newOrder;
  },
  
  updateStatus: async (orderId, status) => {
    await simulateDelay();
    toast.success('Estado del pedido actualizado');
    return { success: true };
  },
  
  getStatistics: async () => {
    await simulateDelay();
    return {
      total_orders: MOCK_ORDERS.length,
      pending_orders: MOCK_ORDERS.filter(o => o.status === 'pending').length,
      completed_orders: MOCK_ORDERS.filter(o => o.status === 'delivered').length,
    };
  },
};

export default {
  authService,
  productService,
  categoryService,
  cartService,
  orderService,
};