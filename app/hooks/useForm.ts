import * as validators from "@/app/utils/validators";
import { useCallback, useState } from "react";

interface FormField {
  name: string;
  value: unknown;
  error?: string;
  required?: boolean;
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
    custom?: (value: unknown) => boolean | string;
  };
}

interface UseFormOptions {
  initialValues?: Record<string, unknown>;
  onSubmit?: (values: Record<string, unknown>) => void | Promise<void>;
  validateOnChange?: boolean;
}

export const useForm = ({
  initialValues = {},
  onSubmit,
  validateOnChange = true,
}: UseFormOptions) => {
  const [values, setValues] = useState<Record<string, unknown>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback(
    (
      name: string,
      value: unknown,
      rules?: FormField["validation"]
    ): string | null => {
      if (!rules) return null;

      // Validation requise
      if (rules.required && !validators.isRequired(value)) {
        return "Ce champ est requis";
      }

      // Validation de longueur minimale
      if (
        rules.min &&
        typeof value === "string" &&
        !validators.minLength(value, rules.min)
      ) {
        return `Minimum ${rules.min} caractères`;
      }

      // Validation de longueur maximale
      if (
        rules.max &&
        typeof value === "string" &&
        !validators.maxLength(value, rules.max)
      ) {
        return `Maximum ${rules.max} caractères`;
      }

      // Validation par pattern
      if (rules.pattern && typeof value === "string") {
        const regex = new RegExp(rules.pattern);
        if (!regex.test(value)) {
          return "Format invalide";
        }
      }

      // Validation personnalisée
      if (rules.custom) {
        const result = rules.custom(value);
        if (typeof result === "string") return result;
        if (!result) return "Valeur invalide";
      }

      return null;
    },
    []
  );

  const setValue = useCallback(
    (name: string, value: unknown, rules?: FormField["validation"]) => {
      setValues((prev) => ({ ...prev, [name]: value }));

      if (validateOnChange) {
        const error = validateField(name, value, rules);
        setErrors((prev) => ({ ...prev, [name]: error || "" }));
      }
    },
    [validateField, validateOnChange]
  );

  const setError = useCallback((name: string, error: string) => {
    setErrors((prev) => ({ ...prev, [name]: error }));
  }, []);

  const clearError = useCallback((name: string) => {
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }, []);

  const validateForm = useCallback(
    (fields: FormField[]): boolean => {
      const newErrors: Record<string, string> = {};
      let isValid = true;

      fields.forEach((field) => {
        const error = validateField(field.name, field.value, field.validation);
        if (error) {
          newErrors[field.name] = error;
          isValid = false;
        }
      });

      setErrors(newErrors);
      return isValid;
    },
    [validateField]
  );

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();

      setIsSubmitting(true);
      try {
        if (onSubmit) {
          await onSubmit(values);
        }
      } catch (error) {
        console.error("Form submission error:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, onSubmit]
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    isSubmitting,
    setValue,
    setError,
    clearError,
    validateForm,
    handleSubmit,
    reset,
  };
};
