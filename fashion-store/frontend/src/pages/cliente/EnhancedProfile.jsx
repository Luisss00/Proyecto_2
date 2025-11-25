import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useProfileValidation } from '../../hooks/useProfileValidation';
import { useProfileService } from '../../services/profileService';
import ProfileInputField from '../../components/ProfileInputField';
import SaveConfirmation from '../../components/SaveConfirmation';
import SyncStatus from '../../components/SyncStatus';
import { User, Mail, Phone, MapPin, Save, Edit, Camera, Shield, AlertTriangle } from 'lucide-react';
import { toast } from 'react-toastify';

const EnhancedClienteProfile = () => {
  const { user, updateUser, checkAuth } = useAuth();
  const { getProfile, updateProfile, syncWithBackend } = useProfileService();
  
  // Estados principales
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
  });
  
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [originalData, setOriginalData] = useState({});
  
  // Estados para sincronización
  const [lastSync, setLastSync] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Estados para confirmación de guardado
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle', 'saving', 'success', 'error'
  const [saveMessage, setSaveMessage] = useState('');

  // Hook de validación
  const {
    errors,
    isValid,
    touched,
    validateField,
    markAsTouched,
    getFieldError,
    hasFieldError,
  } = useProfileValidation(formData);

  // Cargar perfil del usuario
  const loadProfile = useCallback(async () => {
    try {
      setLoadingProfile(true);
      const profile = await getProfile();
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        address: profile.address || '',
        city: profile.city || '',
      });
      setOriginalData(profile);
      setLastSync(Date.now());
    } catch (error) {
      console.error('Error al cargar perfil:', error);
      toast.error('Error al cargar el perfil. Intenta recargar la página.');
    } finally {
      setLoadingProfile(false);
    }
  }, [getProfile]);

  // Inicializar perfil
  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user, loadProfile]);

  // Manejar cambios de conectividad
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Escuchar eventos de actualización de perfil
  useEffect(() => {
    const handleProfileUpdate = (event) => {
      const updatedProfile = event.detail;
      setFormData(prevData => ({
        ...prevData,
        ...updatedProfile,
      }));
      setLastSync(Date.now());
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, []);

  // Verificar cambios pendientes
  useEffect(() => {
    const hasUnsavedChanges = JSON.stringify(formData) !== JSON.stringify(originalData);
    setHasChanges(hasUnsavedChanges);
  }, [formData, originalData]);

  // Manejar cambio de campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Validación en tiempo real
    validateField(name, value);
  };

  // Manejar blur de campos
  const handleBlur = (e) => {
    const { name, value } = e.target;
    markAsTouched(name);
    validateField(name, value);
  };

  // Cancelar edición
  const handleCancel = () => {
    setFormData(originalData);
    setEditing(false);
    setShowSaveConfirmation(false);
    
    // Limpiar validación
    Object.keys(formData).forEach(key => {
      markAsTouched(key);
    });
  };

  // Guardar perfil
  const handleSave = async () => {
    if (!isValid) {
      toast.error('Por favor corrige los errores antes de guardar');
      return;
    }

    try {
      setSaveStatus('saving');
      setSaveMessage('');
      setShowSaveConfirmation(true);
      
      const updatedProfile = await updateProfile(formData);
      
      // Actualizar contexto de autenticación
      updateUser(updatedProfile);
      setOriginalData(updatedProfile);
      setLastSync(Date.now());
      
      setSaveStatus('success');
      setSaveMessage('Tu perfil ha sido actualizado exitosamente');
      setEditing(false);
      
      // Auto-cerrar después del éxito
      setTimeout(() => {
        setShowSaveConfirmation(false);
      }, 3000);
      
      toast.success('Perfil actualizado exitosamente');
    } catch (error) {
      console.error('Error al guardar perfil:', error);
      setSaveStatus('error');
      setSaveMessage(error.message || 'Error al actualizar el perfil');
    }
  };

  // Sincronizar con backend
  const handleSync = async () => {
    if (!isOnline) {
      toast.error('No hay conexión a internet');
      return;
    }

    try {
      const latestProfile = await syncWithBackend();
      setFormData({
        first_name: latestProfile.first_name || '',
        last_name: latestProfile.last_name || '',
        email: latestProfile.email || '',
        phone: latestProfile.phone || '',
        address: latestProfile.address || '',
        city: latestProfile.city || '',
      });
      setOriginalData(latestProfile);
      setLastSync(Date.now());
      toast.success('Sincronización completada');
    } catch (error) {
      console.error('Error al sincronizar:', error);
      toast.error('Error al sincronizar con el servidor');
    }
  };

  // Reintentar guardado
  const handleRetrySave = () => {
    setSaveStatus('idle');
    handleSave();
  };

  // Entrar en modo edición
  const handleEdit = () => {
    setEditing(true);
    setShowSaveConfirmation(false);
  };

  if (loadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con estado de sincronización */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Mi Perfil
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Gestiona tu información personal
            </p>
          </div>
          
          <SyncStatus
            onSync={handleSync}
            lastSync={lastSync}
            isOnline={isOnline}
            hasChanges={hasChanges && editing}
          />
        </div>

        <div className="flex gap-3">
          {user?.role === 'cliente' && !editing && (
            <a
              href="/productos"
              className="btn-primary flex items-center gap-2"
            >
              <User className="h-5 w-5" />
              Ir a la tienda
            </a>
          )}
          
          {!editing ? (
            <button
              onClick={handleEdit}
              className="btn-secondary flex items-center gap-2"
            >
              <Edit className="h-5 w-5" />
              Editar perfil
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={!isValid || saveStatus === 'saving'}
                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saveStatus === 'saving' ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Guardar cambios
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Advertencias */}
      {!isOnline && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-medium">Sin conexión</span>
          </div>
          <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
            No puedes guardar cambios sin conexión a internet.
          </p>
        </div>
      )}

      {hasChanges && editing && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
            <Edit className="h-5 w-5" />
            <span className="font-medium">Cambios sin guardar</span>
          </div>
          <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
            Tienes cambios pendientes. Recuerda guardar tu perfil.
          </p>
        </div>
      )}

      {/* Información del Usuario */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-8 rounded-full">
              <User className="h-20 w-20 text-white" />
            </div>
            {editing && (
              <button className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 p-2 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <Camera className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
            )}
          </div>
          
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {user?.first_name} {user?.last_name}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">@{user?.username}</p>
            <div className="flex items-center gap-2 mt-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span className="inline-block px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-sm font-medium">
                Cliente Activo
              </span>
            </div>
          </div>
        </div>

        {/* Formulario de edición */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileInputField
              name="first_name"
              label="Nombre"
              value={formData.first_name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Tu nombre"
              error={getFieldError('first_name')}
              disabled={!editing}
              required
            />

            <ProfileInputField
              name="last_name"
              label="Apellido"
              value={formData.last_name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Tu apellido"
              error={getFieldError('last_name')}
              disabled={!editing}
              required
            />

            <ProfileInputField
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="tu@email.com"
              error={getFieldError('email')}
              disabled={!editing}
              required
              icon={Mail}
            />

            <ProfileInputField
              name="phone"
              label="Teléfono"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="+57 300 123 4567"
              error={getFieldError('phone')}
              disabled={!editing}
              icon={Phone}
            />

            <ProfileInputField
              name="city"
              label="Ciudad"
              value={formData.city}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Tu ciudad"
              error={getFieldError('city')}
              disabled={!editing}
              icon={MapPin}
            />

            <ProfileInputField
              name="address"
              label="Dirección"
              value={formData.address}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Calle 123 #45-67"
              error={getFieldError('address')}
              disabled={!editing}
              icon={MapPin}
            />
          </div>

          {/* Resumen de validación */}
          {editing && (
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Estado de validación:</h4>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${isValid ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className={isValid ? 'text-green-600' : 'text-gray-500'}>
                    Formulario válido
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${hasChanges ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
                  <span className={hasChanges ? 'text-orange-600' : 'text-gray-500'}>
                    Cambios pendientes
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={isOnline ? 'text-green-600' : 'text-red-600'}>
                    {isOnline ? 'Conectado' : 'Desconectado'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Información de Cuenta (solo lectura) */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Información de Cuenta
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">Usuario:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {user?.username}
            </span>
          </div>
          <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">Rol:</span>
            <span className="font-medium text-gray-900 dark:text-white capitalize">
              {user?.role}
            </span>
          </div>
          <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">Miembro desde:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {new Date(user?.created_at).toLocaleDateString('es-CO', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-gray-600 dark:text-gray-400">Estado:</span>
            <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-xs font-medium">
              {user?.is_active ? 'Activo' : 'Inactivo'}
            </span>
          </div>
        </div>
      </div>

      {/* Componente de confirmación de guardado */}
      <SaveConfirmation
        show={showSaveConfirmation}
        status={saveStatus}
        message={saveMessage}
        onClose={() => setShowSaveConfirmation(false)}
        onRetry={saveStatus === 'error' ? handleRetrySave : undefined}
      />
    </div>
  );
};

export default EnhancedClienteProfile;