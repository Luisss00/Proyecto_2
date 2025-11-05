import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productService, categoryService } from '../../services/api';
import { Save, Upload, X, Plus, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const isEdit = Boolean(id);

  // Determinar ruta de productos según el rol del usuario
  const getProductsRoute = () => {
    if (user?.role === 'vendedor') return '/vendedor/productos';
    return '/admin/productos';
  };

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    discount_price: '',
    category: '',
    stock: '',
    available_sizes: [],
    colors: [],
    is_featured: false,
    is_active: true,
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState([]); // Archivos seleccionados
  const [existingImages, setExistingImages] = useState([]); // Imágenes existentes en edición
  const [newSize, setNewSize] = useState('');
  const [newColor, setNewColor] = useState('');

  const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  // Helper function to safely parse JSON arrays
  const safeParseArray = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  useEffect(() => {
    fetchCategories();
    if (isEdit) {
      fetchProduct();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Error al cargar las categorías');
    }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const product = await productService.getById(id);
      setFormData({
        name: product.name || '',
        slug: product.slug || '',
        description: product.description || '',
        price: product.price || '',
        discount_price: product.discount_price || '',
        category: product.category?.id || '',
        stock: product.stock || '',
        available_sizes: safeParseArray(product.available_sizes),
        colors: safeParseArray(product.colors),
        is_featured: product.is_featured || false,
        is_active: product.is_active !== undefined ? product.is_active : true,
      });
      
      // Cargar imágenes existentes si es edición
      if (product.images && product.images.length > 0) {
        setExistingImages(product.images);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Error al cargar el producto');
      navigate(getProductsRoute());
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Generar slug automáticamente basado en el nombre
    if (name === 'name') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .trim();
      setFormData(prev => ({
        ...prev,
        slug: slug
      }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 0) {
      // Validar tipos de archivo
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const invalidFiles = files.filter(file => !validTypes.includes(file.type));
      
      if (invalidFiles.length > 0) {
        toast.error('Solo se permiten archivos de imagen (JPEG, PNG, WebP)');
        return;
      }
      
      // Validar tamaño (máximo 5MB por imagen)
      const maxSize = 5 * 1024 * 1024; // 5MB
      const oversizedFiles = files.filter(file => file.size > maxSize);
      
      if (oversizedFiles.length > 0) {
        toast.error('Las imágenes no pueden ser mayores a 5MB');
        return;
      }
      
      // Validar número máximo de imágenes (10)
      if (images.length + files.length > 10) {
        toast.error('Máximo 10 imágenes por producto');
        return;
      }
      
      setImages(prev => [...prev, ...files]);
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (imageId) => {
    if (!window.confirm('¿Estás seguro de eliminar esta imagen?')) return;
    
    try {
      // Por ahora solo la removemos del estado local
      setExistingImages(prev => prev.filter(img => img.id !== imageId));
      toast.success('Imagen eliminada');
    } catch (error) {
      console.error('Error removing image:', error);
      toast.error('Error al eliminar la imagen');
    }
  };

  const handleAddSize = () => {
    if (newSize && !formData.available_sizes.includes(newSize)) {
      setFormData(prev => ({
        ...prev,
        available_sizes: [...prev.available_sizes, newSize]
      }));
      setNewSize('');
    }
  };

  const handleRemoveSize = (size) => {
    setFormData(prev => ({
      ...prev,
      available_sizes: prev.available_sizes.filter(s => s !== size)
    }));
  };

  const handleAddColor = () => {
    if (newColor && !formData.colors.includes(newColor)) {
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, newColor]
      }));
      setNewColor('');
    }
  };

  const handleRemoveColor = (color) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter(c => c !== color)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.price || !formData.category) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    if (formData.discount_price && parseFloat(formData.discount_price) >= parseFloat(formData.price)) {
      toast.error('El precio de descuento debe ser menor al precio normal');
      return;
    }

    if (parseFloat(formData.price) <= 0) {
      toast.error('El precio debe ser mayor a 0');
      return;
    }

    try {
      setSaving(true);
      
      // Determinar si necesitamos usar FormData (si hay imágenes)
      const hasImages = images.length > 0;
      
      let submitData;
      
      if (hasImages) {
        // Crear FormData para envío de archivos
        submitData = new FormData();
        
        // Agregar datos del producto
        submitData.append('name', formData.name);
        submitData.append('slug', formData.slug);
        submitData.append('description', formData.description);
        submitData.append('price', formData.price);
        submitData.append('discount_price', formData.discount_price || '');
        submitData.append('category', formData.category);
        submitData.append('stock', formData.stock);
        submitData.append('available_sizes', JSON.stringify(formData.available_sizes));
        submitData.append('colors', JSON.stringify(formData.colors));
        submitData.append('is_featured', formData.is_featured.toString());
        submitData.append('is_active', formData.is_active.toString());
        
        // Agregar imágenes
        images.forEach((image) => {
          submitData.append('images', image);
        });
      } else {
        // Usar objeto normal sin imágenes
        submitData = {
          name: formData.name,
          slug: formData.slug,
          description: formData.description,
          price: parseFloat(formData.price),
          discount_price: formData.discount_price ? parseFloat(formData.discount_price) : null,
          stock: parseInt(formData.stock) || 0,
          category: parseInt(formData.category),
          available_sizes: formData.available_sizes,
          colors: formData.colors,
          is_featured: formData.is_featured,
          is_active: formData.is_active,
        };
      }

      if (isEdit) {
        await productService.update(id, submitData);
        toast.success('Producto actualizado exitosamente');
      } else {
        await productService.create(submitData);
        toast.success('Producto creado exitosamente');
      }

      navigate(getProductsRoute());
    } catch (error) {
      console.error('Error saving product:', error);
      let errorMessage = 'Error al guardar el producto';
      
      if (error.response?.data) {
        if (typeof error.response.data === 'object') {
          // Manejar errores de validación del serializer
          const fieldErrors = [];
          for (const [field, messages] of Object.entries(error.response.data)) {
            if (Array.isArray(messages)) {
              fieldErrors.push(`${field}: ${messages.join(', ')}`);
            } else {
              fieldErrors.push(`${field}: ${messages}`);
            }
          }
          errorMessage = fieldErrors.join('\n');
        } else {
          errorMessage = error.response.data;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const createImagePreview = (file) => {
    return URL.createObjectURL(file);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isEdit ? 'Editar Producto' : 'Nuevo Producto'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {isEdit ? 'Modifica la información del producto' : 'Completa la información para crear un nuevo producto'}
          </p>
        </div>
        <button
          onClick={() => navigate(getProductsRoute())}
          className="btn-secondary flex items-center gap-2"
        >
          <X className="h-4 w-4" />
          Cancelar
        </button>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Información básica */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Información Básica
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nombre del producto *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="Ej: Camiseta Básica"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Slug (URL amigable) *
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="camiseta-basica"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Descripción *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="input-field"
                  placeholder="Descripción detallada del producto..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Categoría *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="input-field"
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Precios y stock */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Precios y Stock
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Precio normal *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="input-field"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Precio de descuento
                </label>
                <input
                  type="number"
                  name="discount_price"
                  value={formData.discount_price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="input-field"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Stock *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  min="0"
                  className="input-field"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Imágenes */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Imágenes del Producto
          </h2>
          
          {/* Subir imágenes */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Seleccionar imágenes (JPEG, PNG, WebP - máx 5MB cada una)
            </label>
            <input
              type="file"
              multiple
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleImageUpload}
              className="input-field"
            />
            <p className="text-sm text-gray-500 mt-1">
              Máximum 10 imágenes. La primera imagen se marcará como principal.
            </p>
          </div>

          {/* Imágenes existentes (solo en edición) */}
          {isEdit && existingImages.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Imágenes existentes:
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {existingImages.map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.image}
                      alt="Imagen del producto"
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(image.id)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    {image.is_primary && (
                      <span className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                        Principal
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Imágenes seleccionadas */}
          {images.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nuevas imágenes:
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={createImagePreview(image)}
                      alt={`Vista previa ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                        Principal
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {images.length === 0 && (!isEdit || existingImages.length === 0) && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">
                No hay imágenes seleccionadas. Las imágenes ayudan a mostrar mejor tu producto.
              </p>
            </div>
          )}
        </div>

        {/* Tallas y colores */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Tallas Disponibles
            </h2>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <select
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                  className="input-field flex-1"
                >
                  <option value="">Selecciona una talla</option>
                  {SIZES.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddSize}
                  className="btn-secondary flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Agregar
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.available_sizes.map((size) => (
                  <span
                    key={size}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {size}
                    <button
                      type="button"
                      onClick={() => handleRemoveSize(size)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Colores Disponibles
            </h2>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  className="input-field flex-1"
                  placeholder="Ej: Negro, Blanco, Azul"
                />
                <button
                  type="button"
                  onClick={handleAddColor}
                  className="btn-secondary flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Agregar
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.colors.map((color) => (
                  <span
                    key={color}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    {color}
                    <button
                      type="button"
                      onClick={() => handleRemoveColor(color)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Configuración */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Configuración
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Producto destacado (aparecerá en la página principal)
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Producto activo (visible para los clientes)
              </label>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(getProductsRoute())}
            className="btn-secondary"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="btn-primary flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {isEdit ? 'Actualizar Producto' : 'Crear Producto'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;