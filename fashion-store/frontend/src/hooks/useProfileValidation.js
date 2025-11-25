import { useState, useEffect } from 'react';

export const useProfileValidation = (formData) => {
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [touched, setTouched] = useState({});

  // Validaciones en tiempo real
  const validateField = (name, value) => {
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

      default:
        break;
    }

    setErrors(newErrors);
    return newErrors;
  };

  // Validar todo el formulario
  const validateForm = () => {
    const newErrors = {};
    
    // Validar cada campo
    Object.keys(formData).forEach(key => {
      const fieldError = validateField(key, formData[key]);
      Object.assign(newErrors, fieldError);
    });

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
    return Object.keys(newErrors).length === 0;
  };

  // Marcar campo como tocado
  const markAsTouched = (fieldName) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
  };

  // Obtener error de un campo
  const getFieldError = (fieldName) => {
    return touched[fieldName] ? errors[fieldName] : '';
  };

  // Verificar si un campo tiene error
  const hasFieldError = (fieldName) => {
    return touched[fieldName] && errors[fieldName];
  };

  // Efecto para validar cuando cambian los datos
  useEffect(() => {
    validateForm();
  }, [formData]);

  return {
    errors,
    isValid,
    touched,
    validateField,
    validateForm,
    markAsTouched,
    getFieldError,
    hasFieldError,
  };
};