import { authService } from '../services/api';
import { toast } from 'react-toastify';

// Cache para evitar llamadas innecesarias
let profileCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

class ProfileService {
  // Obtener perfil con cache
  async getProfile(useCache = true) {
    const now = Date.now();
    
    // Verificar cache
    if (useCache && profileCache && cacheTimestamp && (now - cacheTimestamp < CACHE_DURATION)) {
      return profileCache;
    }

    try {
      const profile = await authService.getProfile();
      profileCache = profile;
      cacheTimestamp = now;
      return profile;
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      throw this.handleError(error);
    }
  }

  // Actualizar perfil con sincronización bidireccional
  async updateProfile(data) {
    try {
      // Validar datos antes de enviar
      this.validateProfileData(data);
      
      // Llamar al API
      const response = await authService.updateProfile(data);
      
      // Actualizar cache
      profileCache = response;
      cacheTimestamp = Date.now();
      
      // Disparar evento para notificar cambios
      this.notifyProfileUpdate(response);
      
      return response;
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      throw this.handleError(error);
    }
  }

  // Sincronizar con el backend
  async syncWithBackend() {
    try {
      const backendProfile = await this.getProfile(false); // Forzar刷新
      profileCache = backendProfile;
      cacheTimestamp = Date.now();
      return backendProfile;
    } catch (error) {
      console.error('Error al sincronizar con backend:', error);
      throw this.handleError(error);
    }
  }

  // Validar datos del perfil
  validateProfileData(data) {
    const errors = [];

    // Validar nombre
    if (!data.first_name || data.first_name.trim().length < 2) {
      errors.push('El nombre debe tener al menos 2 caracteres');
    }

    // Validar apellido
    if (!data.last_name || data.last_name.trim().length < 2) {
      errors.push('El apellido debe tener al menos 2 caracteres');
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
      errors.push('El formato del email no es válido');
    }

    // Validar teléfono si se proporciona
    if (data.phone && data.phone.trim() !== '') {
      const phoneRegex = /^(\+57)?\s?[0-9\s\-\(\)]{7,15}$/;
      if (!phoneRegex.test(data.phone)) {
        errors.push('El formato del teléfono no es válido');
      }
    }

    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }
  }

  // Manejar errores del API
  handleError(error) {
    if (error.response) {
      // Error del servidor
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          return new Error(data.detail || 'Datos inválidos');
        case 401:
          return new Error('Sesión expirada. Por favor, inicia sesión nuevamente');
        case 403:
          return new Error('No tienes permisos para realizar esta acción');
        case 404:
          return new Error('Perfil no encontrado');
        case 422:
          // Errores de validación de Django
          const validationErrors = [];
          if (data.first_name) validationErrors.push(...data.first_name);
          if (data.last_name) validationErrors.push(...data.last_name);
          if (data.email) validationErrors.push(...data.email);
          if (data.phone) validationErrors.push(...data.phone);
          if (data.address) validationErrors.push(...data.address);
          if (data.city) validationErrors.push(...data.city);
          
          return new Error(validationErrors.join(', ') || 'Datos inválidos');
        case 500:
          return new Error('Error interno del servidor. Intenta nuevamente');
        default:
          return new Error(data.detail || 'Error desconocido del servidor');
      }
    } else if (error.request) {
      // Error de red
      return new Error('Error de conexión. Verifica tu internet');
    } else {
      // Error de configuración
      return new Error('Error de configuración. Contacta al administrador');
    }
  }

  // Notificar actualización del perfil
  notifyProfileUpdate(profile) {
    // Disparar evento personalizado
    const event = new CustomEvent('profileUpdated', { detail: profile });
    window.dispatchEvent(event);

    // Actualizar localStorage si existe
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user) {
        const updatedUser = { ...user, ...profile };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.warn('No se pudo actualizar el usuario en localStorage:', error);
    }
  }

  // Limpiar cache
  clearCache() {
    profileCache = null;
    cacheTimestamp = null;
  }

  // Verificar si hay cambios pendientes
  async hasPendingChanges(localData) {
    try {
      const serverData = await this.getProfile(false);
      return JSON.stringify(localData) !== JSON.stringify(serverData);
    } catch (error) {
      console.error('Error al verificar cambios pendientes:', error);
      return false;
    }
  }
}

export const profileService = new ProfileService();

// Hook para usar el servicio de perfil
export const useProfileService = () => {
  return {
    getProfile: profileService.getProfile.bind(profileService),
    updateProfile: profileService.updateProfile.bind(profileService),
    syncWithBackend: profileService.syncWithBackend.bind(profileService),
    clearCache: profileService.clearCache.bind(profileService),
    hasPendingChanges: profileService.hasPendingChanges.bind(profileService),
  };
};