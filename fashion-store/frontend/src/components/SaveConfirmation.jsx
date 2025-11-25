import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, X, RefreshCw } from 'lucide-react';

const SaveConfirmation = ({ 
  show, 
  status = 'idle', // 'idle', 'saving', 'success', 'error'
  message = '',
  onClose,
  onRetry 
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [show]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  if (!show && !visible) return null;

  const getStatusConfig = () => {
    switch (status) {
      case 'saving':
        return {
          icon: <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />,
          title: 'Guardando...',
          message: 'Actualizando tu perfil, por favor espera.',
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
          borderColor: 'border-blue-200 dark:border-blue-800',
          textColor: 'text-blue-800 dark:text-blue-200',
          showClose: false,
        };
      
      case 'success':
        return {
          icon: <CheckCircle className="h-6 w-6 text-green-500" />,
          title: '¡Guardado exitosamente!',
          message: message || 'Tu perfil ha sido actualizado correctamente.',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-800',
          textColor: 'text-green-800 dark:text-green-200',
          showClose: true,
        };
      
      case 'error':
        return {
          icon: <AlertCircle className="h-6 w-6 text-red-500" />,
          title: 'Error al guardar',
          message: message || 'Ocurrió un error al actualizar tu perfil.',
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-800',
          textColor: 'text-red-800 dark:text-red-200',
          showClose: true,
          showRetry: !!onRetry,
        };
      
      default:
        return {
          icon: null,
          title: '',
          message: '',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-800',
          showClose: false,
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div
      className={`
        fixed top-4 right-4 z-50 min-w-80 max-w-md
        transform transition-all duration-300 ease-in-out
        ${visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div
        className={`
          ${config.bgColor} ${config.borderColor} ${config.textColor}
          border rounded-lg shadow-lg p-4
        `}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            {config.icon}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm">
              {config.title}
            </h4>
            <p className="text-sm opacity-90 mt-1">
              {config.message}
            </p>
            
            {status === 'error' && onRetry && (
              <button
                onClick={onRetry}
                className="mt-3 text-sm font-medium underline hover:no-underline"
              >
                Intentar nuevamente
              </button>
            )}
          </div>
          
          {config.showClose && (
            <button
              onClick={handleClose}
              className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SaveConfirmation;