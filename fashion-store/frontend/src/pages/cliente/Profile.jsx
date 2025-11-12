import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/api';
import { User, Mail, Phone, MapPin, Save, Edit, Camera } from 'lucide-react';
import { toast } from 'react-toastify';

const ClienteProfile = () => {
  const { user, checkAuth } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.updateProfile(formData);
      await checkAuth();
      toast.success('Perfil actualizado exitosamente');
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Mi Perfil
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Gestiona tu información personal
            </p>
          </div>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Edit className="h-5 w-5" />
              Editar
            </button>
          )}
        </div>
      </div>

      {/* Información del Usuario */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-8 rounded-full">
              <User className="h-20 w-20 text-white" />
            </div>
            <button className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 p-2 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <Camera className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {user?.first_name} {user?.last_name}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">@{user?.username}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-sm font-medium">
              Cliente Activo
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <User className="h-4 w-4 inline mr-2" />
                Nombre
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                disabled={!editing}
                className="input-field"
                placeholder="Tu nombre"
              />
            </div>

            {/* Apellido */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <User className="h-4 w-4 inline mr-2" />
                Apellido
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                disabled={!editing}
                className="input-field"
                placeholder="Tu apellido"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Mail className="h-4 w-4 inline mr-2" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!editing}
                className="input-field"
                placeholder="tu@email.com"
              />
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Phone className="h-4 w-4 inline mr-2" />
                Teléfono
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!editing}
                className="input-field"
                placeholder="+57 300 123 4567"
              />
            </div>

            {/* Ciudad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <MapPin className="h-4 w-4 inline mr-2" />
                Ciudad
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                disabled={!editing}
                className="input-field"
                placeholder="Tu ciudad"
              />
            </div>

            {/* Dirección */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <MapPin className="h-4 w-4 inline mr-2" />
                Dirección
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={!editing}
                className="input-field"
                placeholder="Calle 123 #45-67"
              />
            </div>
          </div>

          {editing && (
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setFormData({
                    first_name: user?.first_name || '',
                    last_name: user?.last_name || '',
                    email: user?.email || '',
                    phone: user?.phone || '',
                    address: user?.address || '',
                    city: user?.city || '',
                  });
                }}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center gap-2"
              >
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
          )}
        </form>
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
    </div>
  );
};

export default ClienteProfile;