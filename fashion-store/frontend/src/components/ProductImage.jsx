import { useState, useRef, useEffect } from 'react';
import { ImageOff } from 'lucide-react';

/**
 * Componente optimizado para mostrar imágenes de productos con lazy loading
 * @param {Object} props
 * @param {string} props.src - URL de la imagen
 * @param {string} props.alt - Texto alternativo
 * @param {string} props.className - Clases CSS adicionales
 * @param {string} props.size - Tamaño: 'sm', 'md', 'lg', 'xl'
 * @param {boolean} props.priority - Si la imagen debe cargarse inmediatamente
 * @param {string} props.fallbackImage - Imagen por defecto personalizada
 * @param {Object} props.style - Estilos adicionales
 */
const ProductImage = ({ 
  src, 
  alt = 'Producto', 
  className = '', 
  size = 'md', 
  priority = false,
  fallbackImage,
  style = {},
  ...props 
}) => {
  const [imageSrc, setImageSrc] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  // Configuración de tamaños responsivos
  const sizeConfig = {
    xs: { width: 'w-12 h-12', container: 'p-1', icon: 'h-4 w-4' },
    sm: { width: 'w-16 h-16', container: 'p-2', icon: 'h-5 w-5' },
    md: { width: 'w-24 h-24', container: 'p-2', icon: 'h-6 w-6' },
    lg: { width: 'w-32 h-32', container: 'p-3', icon: 'h-8 w-8' },
    xl: { width: 'w-48 h-48', container: 'p-4', icon: 'h-10 w-10' }
  };

  // Imagen por defecto mejorada
  const defaultFallbackImage = fallbackImage || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNMCAwTDIwIDBMMCAyMFoiIGZpbGw9IiNmOGY5ZmEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=';

  // URLs de imágenes optimizadas (thumbnail)
  const getOptimizedImageUrl = (url) => {
    if (!url) return null;
    
    // Si es una imagen local de Django
    if (url.startsWith('/media/')) {
      // Agregar parámetros para optimización
      const separator = url.includes('?') ? '&' : '?';
      return `${url}${separator}width=300&height=300&format=webp&quality=80`;
    }
    
    return url;
  };

  // Lazy loading con Intersection Observer
  useEffect(() => {
    if (priority || isInView) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observerRef.current?.disconnect();
        }
      },
      {
        rootMargin: '50px', // Cargar 50px antes de que entre en vista
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [priority, isInView]);

  // Cargar imagen cuando esté en vista
  useEffect(() => {
    if (isInView && src) {
      const optimizedSrc = getOptimizedImageUrl(src);
      setImageSrc(optimizedSrc);
    } else if (isInView && !src) {
      setImageSrc(defaultFallbackImage);
      setHasError(true);
      setIsLoading(false);
    }
  }, [isInView, src]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setImageSrc(defaultFallbackImage);
    setHasError(true);
    setIsLoading(false);
  };

  const config = sizeConfig[size] || sizeConfig.md;

  return (
    <div 
      ref={imgRef}
      className={`
        relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 
        ${config.width} ${config.container}
        ${className}
      `}
      style={style}
      {...props}
    >
      {/* Loading skeleton */}
      {isLoading && (
        <div className={`
          absolute inset-0 bg-gray-200 dark:bg-gray-700 
          animate-pulse rounded-lg flex items-center justify-center
          ${config.width}
        `}>
          <div className="text-gray-400">
            <svg className={`${config.icon} animate-pulse`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      )}

      {/* Imagen principal */}
      {isInView && (
        <img
          src={imageSrc || defaultFallbackImage}
          alt={alt}
          className={`
            w-full h-full object-cover transition-opacity duration-300
            ${isLoading ? 'opacity-0' : 'opacity-100'}
            ${hasError ? 'filter grayscale' : ''}
          `}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
        />
      )}

      {/* Error overlay */}
      {hasError && !isLoading && (
        <div className={`
          absolute inset-0 flex items-center justify-center 
          bg-gray-100 dark:bg-gray-800 text-gray-400
        `}>
          <ImageOff className={config.icon} />
        </div>
      )}

      {/* Indicador de calidad (solo en desarrollo) */}
      {process.env.NODE_ENV === 'development' && hasError && (
        <div className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 rounded">
          Error
        </div>
      )}
    </div>
  );
};

export default ProductImage;