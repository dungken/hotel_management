import { useState, useCallback } from 'react';

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean;
  message?: string;
}

interface ValidationRules {
  [key: string]: ValidationRule;
}

interface ValidationErrors {
  [key: string]: string;
}

export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  validationRules: ValidationRules = {}
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = useCallback(
    (name: string, value: any): string | null => {
      const rules = validationRules[name];
      if (!rules) return null;

      if (rules.required && !value) {
        return rules.message || `${name} is required`;
      }

      if (rules.minLength && value.length < rules.minLength) {
        return rules.message || `${name} must be at least ${rules.minLength} characters`;
      }

      if (rules.maxLength && value.length > rules.maxLength) {
        return rules.message || `${name} must be less than ${rules.maxLength} characters`;
      }

      if (rules.pattern && !rules.pattern.test(value)) {
        return rules.message || `${name} is invalid`;
      }

      if (rules.custom && !rules.custom(value)) {
        return rules.message || `${name} is invalid`;
      }

      return null;
    },
    [validationRules]
  );

  const validateForm = useCallback((): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach((fieldName) => {
      const error = validateField(fieldName, values[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validationRules, validateField]);

  const handleChange = useCallback(
    (name: string, value: any) => {
      setValues((prev) => ({ ...prev, [name]: value }));
      
      if (touched[name]) {
        const error = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: error || '' }));
      }
    },
    [touched, validateField]
  );

  const handleBlur = useCallback(
    (name: string) => {
      setTouched((prev) => ({ ...prev, [name]: true }));
      
      const error = validateField(name, values[name]);
      setErrors((prev) => ({ ...prev, [name]: error || '' }));
    },
    [values, validateField]
  );

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    setValues,
    setErrors,
  };
}
