import api from './api';

const storeConfigService = {
  // Obtener configuración pública (para el footer)
  getPublicConfig: async () => {
    try {
      const response = await api.get('/store/config/public/');
      return response.data;
    } catch (error) {
      console.error('Error al obtener configuración pública:', error);
      // Retornar valores por defecto en caso de error
      return {
        store_name: 'Fashion Store',
        store_email: 'info@fashionstore.com',
        store_phone: '+57 300 123 4567',
        store_address: 'Cienaga Magdalena, Colombia',
        facebook_url: 'https://facebook.com/fashionstore',
        instagram_url: 'https://instagram.com/fashionstore',
        twitter_url: 'https://twitter.com/fashionstore',
      };
    }
  },

  // Obtener configuración completa (para admin)
  getConfig: async () => {
    try {
      const response = await api.get('/store/config/');
      return response.data;
    } catch (error) {
      console.error('Error al obtener configuración:', error);
      throw error;
    }
  },

  // Actualizar configuración (incluye logo)
  updateConfig: async (configData, logoFile = null) => {
    try {
      let data = configData;
      
      // Si hay archivo de logo, usar FormData
      if (logoFile) {
        const formData = new FormData();
        
        // Agregar todos los campos del configData
        Object.keys(configData).forEach(key => {
          formData.append(key, configData[key]);
        });
        
        // Agregar el archivo de logo
        formData.append('logo', logoFile);
        
        data = formData;
      }
      
      const response = await api.post('/store/config/', data);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar configuración:', error);
      throw error;
    }
  },

  // Formatear datos del formulario para la API
  formatFormData: (formData) => {
    return {
      store_name: formData.storeName,
      store_email: formData.storeEmail,
      store_phone: formData.storePhone,
      store_address: formData.storeAddress,
      facebook_url: formData.facebook,
      instagram_url: formData.instagram,
      twitter_url: formData.twitter,
      enable_nequi: formData.enableNequi,
      enable_stripe: formData.enableStripe,
      enable_mercadopago: formData.enableMercadoPago,
      enable_contra_entrega: formData.enableContraEntrega,
      shipping_cost: parseFloat(formData.shippingCost),
      free_shipping_min: parseFloat(formData.freeShippingMin),
      tax_rate: parseFloat(formData.taxRate),
    };
  },

  // Formatear datos de la API para el formulario
  formatApiToForm: (apiData) => {
    return {
      storeName: apiData.store_name || '',
      storeEmail: apiData.store_email || '',
      storePhone: apiData.store_phone || '',
      storeAddress: apiData.store_address || '',
      facebook: apiData.facebook_url || '',
      instagram: apiData.instagram_url || '',
      twitter: apiData.twitter_url || '',
      enableNequi: apiData.enable_nequi || false,
      enableStripe: apiData.enable_stripe || false,
      enableMercadoPago: apiData.enable_mercadopago || false,
      enableContraEntrega: apiData.enable_contra_entrega || false,
      shippingCost: apiData.shipping_cost || 0,
      freeShippingMin: apiData.free_shipping_min || 0,
      taxRate: apiData.tax_rate || 0,
      logoUrl: apiData.logo_url || apiData.logo || null,
    };
  },
};

export default storeConfigService;