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
        banner_title_text: 'Bienvenido a Fashion Store',
        banner_subtitle_text: 'Las mejores tendencias en moda al mejor precio',
        banner_text_color: '#FFFFFF',
        enable_products_button: true,
        enable_offers_button: true,
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

  // Actualizar configuración (incluye logo y banner)
  updateConfig: async (configData, logoFile = null, bannerFile = null) => {
    try {
      let data = configData;
      
      // Si hay archivos, usar FormData
      if (logoFile || bannerFile) {
        const formData = new FormData();
        
        // Agregar todos los campos del configData
        Object.keys(configData).forEach(key => {
          formData.append(key, configData[key]);
        });
        
        // Agregar archivos si existen
        if (logoFile) {
          formData.append('logo', logoFile);
        }
        
        if (bannerFile) {
          formData.append('banner_image', bannerFile);
        }
        
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
      banner_type: formData.bannerType,
      banner_color: formData.bannerColor,
      banner_title_text: formData.bannerTitleText,
      banner_subtitle_text: formData.bannerSubtitleText,
      banner_text_color: formData.bannerTextColor || '#FFFFFF',
      enable_products_button: formData.enableProductsButton,
      enable_offers_button: formData.enableOffersButton,
      footer_background_color: formData.footerBackgroundColor || '#1F2937',
      footer_text_color: formData.footerTextColor || '#D1D5DB',
      footer_title_color: formData.footerTitleColor || '#FFFFFF',
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
      bannerType: apiData.banner_type || 'color',
      bannerColor: apiData.banner_color || '#3B82F6',
      bannerImageUrl: apiData.banner_image_url || apiData.banner_image || null,
      bannerTitleText: apiData.banner_title_text || 'Bienvenido a Fashion Store',
      bannerSubtitleText: apiData.banner_subtitle_text || 'Las mejores tendencias en moda al mejor precio',
      bannerTextColor: apiData.banner_text_color || '#FFFFFF',
      enableProductsButton: apiData.enable_products_button !== false,
      enableOffersButton: apiData.enable_offers_button !== false,
      footerBackgroundColor: apiData.footer_background_color || '#1F2937',
      footerTextColor: apiData.footer_text_color || '#D1D5DB',
      footerTitleColor: apiData.footer_title_color || '#FFFFFF',
    };
  },
};

export default storeConfigService;