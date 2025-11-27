import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useProfileService } from '../../services/profileService';
import ProfileInputField from '../../components/ProfileInputField';
import SaveConfirmation from '../../components/SaveConfirmation';
import SyncStatus from '../../components/SyncStatus';
import { User, Mail, Phone, MapPin, Save, Edit, Camera, Shield, AlertTriangle, Heart, Eye, ShoppingCart } from 'lucide-react';
import { toast } from 'react-toastify';

// Hook de validación optimizado
const useProfileValidation = (formData, editing) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Validaciones memoizadas
  const validateField = useCallback((name, value) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'first_name':
        if (!value || value.trim() === '') {
          newErrors.first_name = 'El nombre es requerido';
        } else if (value.length < 2) {
          newErrors.first_name = 'El nombre debe tener al menos 2 caracteres';
        } else {
          delete newErrors.first_name;
        }
        break;
      case 'last_name':
        if (!value || value.trim() === '') {
          newErrors.last_name = 'El apellido es requerido';
        } else if (value.length < 2) {
          newErrors.last_name = 'El apellido debe tener al menos 2 caracteres';
        } else {
          delete newErrors.last_name;
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value || value.trim() === '') {
          newErrors.email = 'El email es requerido';
        } else if (!emailRegex.test(value)) {
          newErrors.email = 'El formato del email no es válido';
        } else {
          delete newErrors.email;
        }
        break;
      case 'phone':
        const phoneRegex = /^(\+57)?\s?[0-9\s\-\(\)]{7,15}$/;
        if (value && value.trim() !== '' && !phoneRegex.test(value)) {
          newErrors.phone = 'El formato del teléfono no es válido';
        } else {
          delete newErrors.phone;
        }
        break;
      case 'address':
        if (value && value.trim() !== '' && value.length < 5) {
          newErrors.address = 'La dirección debe tener al menos 5 caracteres';
        } else {
          delete newErrors.address;
        }
        break;
      case 'city':
        if (value && value.trim() !== '' && value.length < 2) {
          newErrors.city = 'La ciudad debe tener al menos 2 caracteres';
        } else {
          delete newErrors.city;
        }
        break;
    }
    
    setErrors(newErrors);
    return newErrors;
  }, [errors]);

  const markAsTouched = useCallback((fieldName) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
  }, []);

  const getFieldError = useCallback((fieldName) => {
    return touched[fieldName] ? errors[fieldName] : '';
  }, [touched, errors]);

  const isValid = useMemo(() => {
    return editing && Object.keys(errors).length === 0 && 
           formData.first_name && formData.last_name && formData.email;
  }, [editing, errors, formData.first_name, formData.last_name, formData.email]);

  return {
    errors,
    isValid,
    touched,
    validateField,
    markAsTouched,
    getFieldError,
  };
};

const OptimizedClienteProfile = () => {
  const { user, updateUser } = useAuth();
  const { favorites, count } = useFavorites();
  const { getProfile, updateProfile, syncWithBackend } = useProfileService();
  
  // Estados principales optimizados
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
  });
  
  const [originalData, setOriginalData] = useState({});
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  
  // Estados para sincronización
  const [lastSync, setLastSync] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  
  // Estados para confirmación
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle');
  const [saveMessage, setSaveMessage] = useState('');

  // Hook de validación optimizado
  const {
    errors,
    isValid,
    touched,
    validateField,
    markAsTouched,
    getFieldError,
  } = useProfileValidation(formData, editing);

  // Memoizar datos del usuario
  const userDisplayName = useMemo(() => {
    if (!user) return '';
    return `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username;
  }, [user]);

  // Cargar perfil una sola vez
  useEffect(() => {
    let isMounted = true;
    
    const loadProfile = async () => {
      if (!user || !isMounted) return;
      
      try {
        setLoadingProfile(true);
        const profile = await getProfile();
        
        if (!isMounted) return;
        
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
        if (isMounted) {
          toast.error('Error al cargar el perfil');
        }
      } finally {
        if (isMounted) {
          setLoadingProfile(false);
        }
      }
    };

    loadProfile();
    
    return () => {
      isMounted = false;
    };
  }, [user?.id]); // Solo depende del ID del usuario

  // Detectar cambios pendientes (optimizado)
  const hasChanges = useMemo(() => {
    return editing && (
      formData.first_name !== originalData.first_name ||
      formData.last_name !== originalData.last_name ||
      formData.email !== originalData.email ||
      formData.phone !== originalData.phone ||
      formData.address !== originalData.address ||
      formData.city !== originalData.city
    );
  }, [formData, originalData, editing]);

  // Manejar cambio de campos (optimizado)
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  // Manejar blur de campos
  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    markAsTouched(name);
    validateField(name, value);
  }, [markAsTouched, validateField]);

  // Cancelar edición
  const handleCancel = useCallback(() => {
    setFormData(originalData);
    setEditing(false);
    setShowSaveConfirmation(false);
  }, [originalData]);

  // Guardar perfil
  const handleSave = useCallback(async () => {
    if (!isValid) {
      toast.error('Por favor corrige los errores antes de guardar');
      return;
    }

    try {
      setSaveStatus('saving');
      setSaveMessage('');
      setShowSaveConfirmation(true);
      
      const updatedProfile = await updateProfile(formData);
      updateUser(updatedProfile);
      setOriginalData(updatedProfile);
      setLastSync(Date.now());
      
      setSaveStatus('success');
      setSaveMessage('Tu perfil ha sido actualizado exitosamente');
      setEditing(false);
      
      setTimeout(() => {
        setShowSaveConfirmation(false);
      }, 3000);
      
      toast.success('Perfil actualizado exitosamente');
    } catch (error) {
      console.error('Error al guardar perfil:', error);
      setSaveStatus('error');
      setSaveMessage(error.message || 'Error al actualizar el perfil');
    }
  }, [isValid, formData, updateProfile, updateUser]);

  // Sincronizar con backend
  const handleSync = useCallback(async () => {
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
  }, [isOnline, syncWithBackend]);

  // Reintentar guardado
  const handleRetrySave = useCallback(() => {
    setSaveStatus('idle');
    handleSave();
  }, [handleSave]);

  // Entrar en modo edición
  const handleEdit = useCallback(() => {
    setEditing(true);
    setShowSaveConfirmation(false);
  }, []);

  // Loading state
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
      {/* Header */}
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
            hasChanges={hasChanges}
          />
        </div>

        <div className="flex gap-3 items-center">
          {!editing ? (
            <button
              onClick={handleEdit}
              className="btn-secondary flex items-center gap-2 px-4 py-2 text-sm"
            >
              <Edit className="h-4 w-4" />
              Editar perfil
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="btn-secondary px-4 py-2 text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={!isValid || saveStatus === 'saving'}
                className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {saveStatus === 'saving' ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Guardar cambios
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sección de Favoritos */}
      <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl shadow-sm p-6 border border-red-100 dark:border-red-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 dark:bg-red-900 p-2 rounded-full">
              <Heart className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Mis Favoritos
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {count} {count === 1 ? 'producto guardado' : 'productos guardados'}
              </p>
            </div>
          </div>
          
          <Link 
            to="/cliente/favoritos"
            className="btn-primary flex items-center gap-2 px-4 py-2"
          >
            <Eye className="h-4 w-4" />
            Ver todos
          </Link>
        </div>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {favorites.slice(0, 4).map((favorite) => {
              const product = favorite.product;
              return (
                <div key={favorite.id} className="group relative">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
                    <img
                      src={product.primary_image || 'https://via.placeholder.com/150'}
                      alt={product.name}
                      className="w-full h-24 object-cover rounded-md mb-2 group-hover:scale-105 transition-transform duration-200"
                    />
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                      {product.name}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      ${product.final_price || product.price}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Heart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Aún no tienes productos favoritos
            </p>
            <Link 
              to="/productos"
              className="btn-secondary inline-flex items-center gap-2"
            >
              <ShoppingCart className="h-4 w-4" />
              Explorar productos
            </Link>
          </div>
        )}
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

      {hasChanges && (
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
              {userDisplayName}
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

      {/* Información de Cuenta */}
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
              {user?.created_at ? new Date(user.created_at).toLocaleDateString('es-CO', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              }) : 'N/A'}
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

      {/* Confirmación de guardado */}
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

export default OptimizedClienteProfile;