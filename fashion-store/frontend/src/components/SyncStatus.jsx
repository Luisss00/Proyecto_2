import React, { useState } from 'react';
import { RefreshCw, CheckCircle, AlertCircle, Wifi, WifiOff } from 'lucide-react';

const SyncStatus = ({ 
  onSync, 
  lastSync, 
  isOnline = true, 
  isLoading = false,
  hasChanges = false,
  className = '' 
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const formatLastSync = (timestamp) => {
    if (!timestamp) return 'Nunca';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Ahora mismo';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Hace ${diffHours}h`;
    
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Estado de conexión */}
          <div className="flex items-center gap-2">
            {isOnline ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-500" />
            )}
            <span className={`text-sm font-medium ${
              isOnline ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
            }`}>
              {isOnline ? 'Conectado' : 'Desconectado'}
            </span>
          </div>

          {/* Estado de sincronización */}
          {isLoading && (
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span className="text-sm">Sincronizando...</span>
            </div>
          )}

          {!isLoading && hasChanges && (
            <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">Cambios sin guardar</span>
            </div>
          )}

          {!isLoading && !hasChanges && (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">Sincronizado</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onSync}
            disabled={isLoading || !isOnline}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Sincronizar
          </button>

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm"
          >
            {showDetails ? 'Ocultar' : 'Detalles'}
          </button>
        </div>
      </div>

      {/* Detalles expandibles */}
      {showDetails && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Última sincronización:</span>
              <div className="font-medium text-gray-900 dark:text-white">
                {formatLastSync(lastSync)}
              </div>
            </div>
            
            <div>
              <span className="text-gray-600 dark:text-gray-400">Estado de conexión:</span>
              <div className="font-medium text-gray-900 dark:text-white">
                {isOnline ? 'Online' : 'Offline'}
              </div>
            </div>
            
            <div>
              <span className="text-gray-600 dark:text-gray-400">Cambios pendientes:</span>
              <div className={`font-medium ${hasChanges ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'}`}>
                {hasChanges ? 'Sí' : 'No'}
              </div>
            </div>
            
            <div>
              <span className="text-gray-600 dark:text-gray-400">Actividad:</span>
              <div className="font-medium text-gray-900 dark:text-white">
                {isLoading ? 'Sincronizando...' : 'Estable'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SyncStatus;