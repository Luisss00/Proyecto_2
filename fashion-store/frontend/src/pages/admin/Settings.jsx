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
  });

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

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

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const apiData = storeConfigService.formatFormData(settings);
      const updatedConfig = await storeConfigService.updateConfig(apiData, logoFile);
      
      // Actualizar el estado local con los datos actualizados
      const formData = storeConfigService.formatApiToForm(updatedConfig);
      setSettings(formData);
      
      // Limpiar el logo temporal
      setLogoFile(null);
      setLogoPreview(null);
      
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