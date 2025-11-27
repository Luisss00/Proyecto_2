import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, Upload, Mail, Phone, MapPin, CreditCard } from 'lucide-react';
import { toast } from 'react-toastify';
import storeConfigService from '../../services/storeConfig';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    storeName: 'Fashion Store',
    storeEmail: 'info@fashionstore.com',
    storePhone: '+57 300 123 4567',
    storeAddress: 'Cienaga Magdalena, Colombia',
    facebook: 'https://facebook.com/fashionstore',
    instagram: 'https://instagram.com/fashionstore',
    twitter: 'https://twitter.com/fashionstore',
    enableNequi: true,
    enableStripe: false,
    enableMercadoPago: false,
    enableContraEntrega: true,
    shippingCost: 15000,
    freeShippingMin: 100000,
    taxRate: 19,
    logoUrl: null,
    bannerType: 'color',
    bannerColor: '#3B82F6',
    bannerImageUrl: null,
    footerBackgroundColor: '#1F2937',
    footerTextColor: '#D1D5DB',
    footerTitleColor: '#FFFFFF',
  });

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  // Cargar configuración inicial
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const configData = await storeConfigService.getConfig();
        const formData = storeConfigService.formatApiToForm(configData);
        setSettings(formData);
      } catch (error) {
        console.error('Error al cargar configuración:', error);
        toast.error('Error al cargar la configuración');
      } finally {
        setInitialLoading(false);
      }
    };

    loadConfig();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Validar tipo de archivo
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error('Solo se permiten archivos de imagen (JPEG, PNG, WebP)');
        return;
      }
      
      // Validar tamaño (2MB)
      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error('El archivo no puede ser mayor a 2MB');
        return;
      }
      
      setLogoFile(file);
      
      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Validar tipo de archivo
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error('Solo se permiten archivos de imagen (JPEG, PNG, WebP)');
        return;
      }
      
      // Validar tamaño (5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error('El archivo no puede ser mayor a 5MB');
        return;
      }
      
      setBannerFile(file);
      
      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeBanner = () => {
    setBannerFile(null);
    setBannerPreview(null);
  };

  const validateColor = (color) => {
    const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return hexPattern.test(color);
  };

  const validateAllColors = () => {
    const errors = [];
    
    // Validar color del banner
    if (settings.bannerType === 'color' && !validateColor(settings.bannerColor)) {
      errors.push('Banner: Ingresa un código de color válido (ej: #3B82F6)');
    }

    // Validar colores del footer
    if (!validateColor(settings.footerBackgroundColor)) {
      errors.push('Footer: Color de fondo inválido');
    }
    
    if (!validateColor(settings.footerTextColor)) {
      errors.push('Footer: Color de texto inválido');
    }
    
    if (!validateColor(settings.footerTitleColor)) {
      errors.push('Footer: Color de títulos inválido');
    }

    return errors;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validar todos los colores
      const colorErrors = validateAllColors();
      if (colorErrors.length > 0) {
        toast.error(`Errores de validación: ${colorErrors.join(', ')}`);
        setLoading(false);
        return;
      }
      
      const apiData = storeConfigService.formatFormData(settings);
      const updatedConfig = await storeConfigService.updateConfig(apiData, logoFile, bannerFile);
      
      // Actualizar el estado local con los datos actualizados
      const formData = storeConfigService.formatApiToForm(updatedConfig);
      setSettings(formData);
      
      // Limpiar archivos temporales
      setLogoFile(null);
      setLogoPreview(null);
      setBannerFile(null);
      setBannerPreview(null);
      
      toast.success('Configuración guardada exitosamente');
    } catch (error) {
      console.error('Error al guardar configuración:', error);
      toast.error('Error al guardar configuración');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Mostrar loading durante la carga inicial
  if (initialLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Configuración del Sistema</h1>
          <p className="text-gray-600 mt-1">Administra la configuración general</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-3 text-gray-600">Cargando configuración...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configuración del Sistema</h1>
        <p className="text-gray-600 mt-1">Administra la configuración general</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="card">
          <div className="flex items-center gap-2 mb-6">
            <SettingsIcon className="h-6 w-6 text-primary-600" />
            <h2 className="text-xl font-semibold">Información General</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la Tienda
              </label>
              <input
                type="text"
                name="storeName"
                value={settings.storeName}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="h-4 w-4 inline mr-2" />
                Email
              </label>
              <input
                type="email"
                name="storeEmail"
                value={settings.storeEmail}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="h-4 w-4 inline mr-2" />
                Teléfono
              </label>
              <input
                type="text"
                name="storePhone"
                value={settings.storePhone}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="h-4 w-4 inline mr-2" />
                Dirección
              </label>
              <input
                type="text"
                name="storeAddress"
                value={settings.storeAddress}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Personalización del Footer</h2>
          
          {/* Vista Previa del Footer */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Vista Previa</label>
            <div className="relative border border-gray-300 rounded-lg overflow-hidden">
              <div 
                className="p-6"
                style={{ 
                  backgroundColor: settings.footerBackgroundColor,
                  color: settings.footerTextColor
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 
                      className="font-semibold mb-3"
                      style={{ color: settings.footerTitleColor }}
                    >
                      Enlaces Rápidos
                    </h3>
                    <ul className="space-y-1 text-sm">
                      <li>Inicio</li>
                      <li>Productos</li>
                      <li>Ofertas</li>
                      <li>Mi Cuenta</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 
                      className="font-semibold mb-3"
                      style={{ color: settings.footerTitleColor }}
                    >
                      Categorías
                    </h3>
                    <ul className="space-y-1 text-sm">
                      <li>Ropa</li>
                      <li>Zapatos</li>
                      <li>Accesorios</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 
                      className="font-semibold mb-3"
                      style={{ color: settings.footerTitleColor }}
                    >
                      Contacto
                    </h3>
                    <ul className="space-y-1 text-sm">
                      <li>info@fashionstore.com</li>
                      <li>+57 300 123 4567</li>
                    </ul>
                  </div>
                </div>
                
                <div 
                  className="border-t mt-4 pt-4 text-center text-sm"
                  style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
                >
                  © 2025 Fashion Store. Todos los derechos reservados.
                </div>
              </div>
            </div>
          </div>

          {/* Controles de Color del Footer */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color de Fondo</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  name="footerBackgroundColor"
                  value={settings.footerBackgroundColor}
                  onChange={handleChange}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  name="footerBackgroundColor"
                  value={settings.footerBackgroundColor}
                  onChange={handleChange}
                  placeholder="#1F2937"
                  className="input-field flex-1"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Fondo principal del footer</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color de Texto</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  name="footerTextColor"
                  value={settings.footerTextColor}
                  onChange={handleChange}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  name="footerTextColor"
                  value={settings.footerTextColor}
                  onChange={handleChange}
                  placeholder="#D1D5DB"
                  className="input-field flex-1"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Color de los textos generales</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color de Títulos</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  name="footerTitleColor"
                  value={settings.footerTitleColor}
                  onChange={handleChange}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  name="footerTitleColor"
                  value={settings.footerTitleColor}
                  onChange={handleChange}
                  placeholder="#FFFFFF"
                  className="input-field flex-1"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Color de los títulos y encabezados</p>
            </div>
          </div>

          {/* Botones para Colores Predefinidos */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Colores Predefinidos</h3>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSettings({
                  ...settings,
                  footerBackgroundColor: '#1F2937',
                  footerTextColor: '#D1D5DB',
                  footerTitleColor: '#FFFFFF'
                })}
                className="px-3 py-2 text-xs border border-gray-300 rounded hover:bg-gray-50"
              >
                Oscuro Clásico
              </button>
              <button
                type="button"
                onClick={() => setSettings({
                  ...settings,
                  footerBackgroundColor: '#374151',
                  footerTextColor: '#F9FAFB',
                  footerTitleColor: '#FFFFFF'
                })}
                className="px-3 py-2 text-xs border border-gray-300 rounded hover:bg-gray-50"
              >
                Gris Moderno
              </button>
              <button
                type="button"
                onClick={() => setSettings({
                  ...settings,
                  footerBackgroundColor: '#1F4B99',
                  footerTextColor: '#E5E7EB',
                  footerTitleColor: '#FFFFFF'
                })}
                className="px-3 py-2 text-xs border border-gray-300 rounded hover:bg-gray-50"
              >
                Azul Corporativo
              </button>
              <button
                type="button"
                onClick={() => setSettings({
                  ...settings,
                  footerBackgroundColor: '#7C2D12',
                  footerTextColor: '#FEF3C7',
                  footerTitleColor: '#FFFFFF'
                })}
                className="px-3 py-2 text-xs border border-gray-300 rounded hover:bg-gray-50"
              >
                Marrón Elegante
              </button>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Logo de la Tienda</h2>
          <div className="flex items-center gap-6">
            {/* Preview del Logo */}
            <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
              {logoPreview || settings.logoUrl ? (
                <img 
                  src={logoPreview || settings.logoUrl} 
                  alt="Logo de la tienda" 
                  className="w-full h-full object-contain"
                />
              ) : (
                <SettingsIcon className="h-12 w-12 text-gray-400" />
              )}
            </div>
            
            {/* Controles de Logo */}
            <div className="flex-1">
              {!logoFile ? (
                <div>
                  <label htmlFor="logo-upload" className="btn-secondary flex items-center gap-2 cursor-pointer inline-block">
                    <Upload className="h-5 w-5" />
                    {settings.logoUrl ? 'Cambiar Logo' : 'Subir Logo'}
                  </label>
                  <input
                    id="logo-upload"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                  <p className="text-sm text-gray-500 mt-2">PNG, JPG, WebP. Max 2MB</p>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-green-600 mb-2">✅ {logoFile.name} seleccionado</p>
                  <button 
                    type="button" 
                    onClick={removeLogo}
                    className="btn-secondary text-red-600 border-red-300 hover:bg-red-50"
                  >
                    Remover Logo
                  </button>
                </div>
              )}
              
              {settings.logoUrl && !logoFile && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500">Logo actual: {settings.logoUrl.split('/').pop()}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Banner de la Tienda</h2>
          
          {/* Tipo de Banner */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Tipo de Banner</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="bannerType"
                  value="color"
                  checked={settings.bannerType === 'color'}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <span>Color de Fondo</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="bannerType"
                  value="image"
                  checked={settings.bannerType === 'image'}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <span>Imagen Personalizada</span>
              </label>
            </div>
          </div>

          {/* Vista Previa del Banner */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Vista Previa</label>
            <div className="relative h-40 bg-gray-100 rounded-lg overflow-hidden">
              {settings.bannerType === 'color' ? (
                <div 
                  className="w-full h-full flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: settings.bannerColor }}
                >
                  Vista Previa del Banner - {settings.storeName}
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  {bannerPreview || settings.bannerImageUrl ? (
                    <img 
                      src={bannerPreview || settings.bannerImageUrl} 
                      alt="Vista previa del banner"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <SettingsIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Selecciona una imagen para el banner</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Controles del Banner */}
          <div className="flex items-center gap-6">
            {settings.bannerType === 'color' ? (
              <div className="flex items-center gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color de Fondo</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      name="bannerColor"
                      value={settings.bannerColor}
                      onChange={handleChange}
                      className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      name="bannerColor"
                      value={settings.bannerColor}
                      onChange={handleChange}
                      placeholder="#3B82F6"
                      className="input-field flex-1"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Código hexadecimal del color</p>
                </div>
              </div>
            ) : (
              <div className="flex-1">
                {!bannerFile ? (
                  <div>
                    <label htmlFor="banner-upload" className="btn-secondary flex items-center gap-2 cursor-pointer inline-block">
                      <Upload className="h-5 w-5" />
                      {settings.bannerImageUrl ? 'Cambiar Imagen' : 'Subir Imagen'}
                    </label>
                    <input
                      id="banner-upload"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleBannerChange}
                      className="hidden"
                    />
                    <p className="text-sm text-gray-500 mt-2">PNG, JPG, WebP. Max 5MB</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-green-600 mb-2">✅ {bannerFile.name} seleccionado</p>
                    <button 
                      type="button" 
                      onClick={removeBanner}
                      className="btn-secondary text-red-600 border-red-300 hover:bg-red-50"
                    >
                      Remover Imagen
                    </button>
                  </div>
                )}
                
                {settings.bannerImageUrl && !bannerFile && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500">Imagen actual: {settings.bannerImageUrl.split('/').pop()}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Redes Sociales</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
              <input
                type="url"
                name="facebook"
                value={settings.facebook}
                onChange={handleChange}
                className="input-field"
                placeholder="https://facebook.com/tutienda"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
              <input
                type="url"
                name="instagram"
                value={settings.instagram}
                onChange={handleChange}
                className="input-field"
                placeholder="https://instagram.com/tutienda"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
              <input
                type="url"
                name="twitter"
                value={settings.twitter}
                onChange={handleChange}
                className="input-field"
                placeholder="https://twitter.com/tutienda"
              />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-6">
            <CreditCard className="h-6 w-6 text-primary-600" />
            <h2 className="text-xl font-semibold">Métodos de Pago</h2>
          </div>
          <div className="space-y-4">
            <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                name="enableNequi"
                checked={settings.enableNequi}
                onChange={handleChange}
                className="w-5 h-5"
              />
              <div>
                <p className="font-medium">Nequi</p>
                <p className="text-sm text-gray-500">Pagos a través de Nequi</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                name="enableStripe"
                checked={settings.enableStripe}
                onChange={handleChange}
                className="w-5 h-5"
              />
              <div>
                <p className="font-medium">Stripe (Tarjetas)</p>
                <p className="text-sm text-gray-500">Tarjetas de crédito y débito</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                name="enableMercadoPago"
                checked={settings.enableMercadoPago}
                onChange={handleChange}
                className="w-5 h-5"
              />
              <div>
                <p className="font-medium">MercadoPago</p>
                <p className="text-sm text-gray-500">Pagos a través de MercadoPago</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                name="enableContraEntrega"
                checked={settings.enableContraEntrega}
                onChange={handleChange}
                className="w-5 h-5"
              />
              <div>
                <p className="font-medium">Contra Entrega</p>
                <p className="text-sm text-gray-500">Pago al recibir el pedido</p>
              </div>
            </label>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Envío e Impuestos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Costo de Envío</label>
              <input
                type="number"
                name="shippingCost"
                value={settings.shippingCost}
                onChange={handleChange}
                className="input-field"
              />
              <p className="text-sm text-gray-500 mt-1">
                Actualmente: {formatPrice(settings.shippingCost)}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Envío Gratis Desde
              </label>
              <input
                type="number"
                name="freeShippingMin"
                value={settings.freeShippingMin}
                onChange={handleChange}
                className="input-field"
              />
              <p className="text-sm text-gray-500 mt-1">
                Envío gratis en compras superiores a {formatPrice(settings.freeShippingMin)}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">IVA (%)</label>
              <input
                type="number"
                name="taxRate"
                value={settings.taxRate}
                onChange={handleChange}
                className="input-field"
                min="0"
                max="100"
              />
              <p className="text-sm text-gray-500 mt-1">
                Tasa de impuesto: {settings.taxRate}%
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button type="button" className="btn-secondary">Cancelar</button>
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                Guardar Cambios
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;