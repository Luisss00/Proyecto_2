import React from 'react';
import { User, Mail, Phone, MapPin, AlertCircle, CheckCircle } from 'lucide-react';

const ProfileInputField = ({
  name,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  disabled,
  icon: Icon = User,
  required = false,
  className = '',
}) => {
  const hasError = !!error;
  const isValid = value && !error && !disabled;

  return (
    <div className={`space-y-2 ${className}`}>
      <label 
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        <Icon className="h-4 w-4 inline mr-2" />
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full px-4 py-3 pr-10 border rounded-lg transition-all duration-200
            focus:ring-2 focus:ring-primary-500 focus:border-transparent
            ${hasError 
              ? 'border-red-300 focus:ring-red-500 bg-red-50' 
              : isValid 
                ? 'border-green-300 focus:ring-green-500 bg-green-50' 
                : 'border-gray-300 focus:ring-primary-500 bg-white dark:bg-gray-700 dark:border-gray-600'
            }
            ${disabled 
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
              : 'text-gray-900 dark:text-white'
            }
            dark:bg-gray-800 dark:text-white
          `}
        />
        
        {/* Indicador de estado */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {hasError && (
            <AlertCircle className="h-5 w-5 text-red-500" />
          )}
          {isValid && (
            <CheckCircle className="h-5 w-5 text-green-500" />
          )}
        </div>
      </div>
      
      {/* Mensaje de error */}
      {hasError && (
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      {/* Mensaje de éxito */}
      {isValid && (
        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm">
          <CheckCircle className="h-4 w-4 flex-shrink-0" />
          <span>Campo válido</span>
        </div>
      )}
    </div>
  );
};

export default ProfileInputField;