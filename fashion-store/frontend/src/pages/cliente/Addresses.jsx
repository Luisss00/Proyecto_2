import { useState } from 'react';
import { MapPin, Plus, Edit, Trash2, Home, Building } from 'lucide-react';
import { toast } from 'react-toastify';

const ClienteAddresses = () => {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: 'home',
      title: 'Casa',
      address: 'Calle 123 #45-67',
      city: 'Bogotá',
      phone: '+57 300 123 4567',
      isDefault: true,
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    type: 'home',
    title: '',
    address: '',
    city: '',
    phone: '',
    isDefault: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingAddress) {
      // Editar dirección
      setAddresses(
        addresses.map((addr) =>
          addr.id === editingAddress.id ? { ...formData, id: addr.id } : addr
        )
      );
      toast.success('Dirección actualizada');
    } else {
      // Nueva dirección
      setAddresses([...addresses, { ...formData, id: Date.now() }]);
      toast.success('Dirección agregada');
    }

    setShowForm(false);
    setEditingAddress(null);
    setFormData({
      type: 'home',
      title: '',
      address: '',
      city: '',
      phone: '',
      isDefault: false,
    });
  };

  const deleteAddress = (id) => {
    setAddresses(addresses.filter((addr) => addr.id !== id));
    toast.success('Dirección eliminada');
  };

  const editAddress = (address) => {
    setEditingAddress(address);
    setFormData(address);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Mis Direcciones
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {addresses.length} {addresses.length === 1 ? 'dirección guardada' : 'direcciones guardadas'}
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Nueva Dirección
          </button>
        </div>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {editingAddress ? 'Editar Dirección' : 'Nueva Dirección'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tipo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tipo
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="input-field"
                >
                  <option value="home">Casa</option>
                  <option value="work">Trabajo</option>
                  <option value="other">Otro</option>
                </select>
              </div>

              {/* Título */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Título
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-field"
                  placeholder="Ej: Mi casa"
                  required
                />
              </div>

              {/* Dirección */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Dirección Completa
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="input-field"
                  placeholder="Calle 123 #45-67"
                  required
                />
              </div>

              {/* Ciudad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ciudad
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="input-field"
                  placeholder="Bogotá"
                  required
                />
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Teléfono
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input-field"
                  placeholder="+57 300 123 4567"
                  required
                />
              </div>
            </div>

            {/* Predeterminada */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isDefault"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
              />
              <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Establecer como dirección predeterminada
              </label>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingAddress(null);
                  setFormData({
                    type: 'home',
                    title: '',
                    address: '',
                    city: '',
                    phone: '',
                    isDefault: false,
                  });
                }}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button type="submit" className="btn-primary">
                {editingAddress ? 'Actualizar' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Direcciones */}
      {addresses.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center">
          <MapPin className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No tienes direcciones guardadas
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Agrega direcciones para agilizar tus compras
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 ${
                address.isDefault ? 'ring-2 ring-primary-600' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary-100 dark:bg-primary-900 p-3 rounded-lg">
                    {address.type === 'home' ? (
                      <Home className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    ) : (
                      <Building className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {address.title}
                    </h3>
                    {address.isDefault && (
                      <span className="text-xs text-primary-600 dark:text-primary-400 font-medium">
                        Predeterminada
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => editAddress(address)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => deleteAddress(address.id)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  {address.address}
                </p>
                <p className="ml-6">{address.city}</p>
                <p className="ml-6">{address.phone}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClienteAddresses;