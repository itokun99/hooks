import { useCallback, useEffect, useRef, useState } from "react";

function createErrorObject<T extends object>(
  values: T,
): Record<keyof T, string> {
  const keys = Object.keys(values) as Array<keyof T>;
  const obj: Record<keyof T, string> = {} as Record<keyof T, string>;

  keys.forEach((key) => {
    obj[key] = "";
  });

  return obj;
}

export function useForm<
  T extends object,
  V extends Record<keyof T, string> = Record<keyof T, string>,
>(
  initialState: T,
  validation?: {
    validationState?: V;
    validationCallback?: (
      values: T,
      errors: Record<keyof T, string>,
    ) => typeof errors;
  },
) {
  // Function remains mostly unchanged
  const initialErrorState =
    validation?.validationState ?? createErrorObject<T>(initialState);

  const [values, setValues] = useState<T>(initialState);
  const [errors, setErrors] = useState(initialErrorState);

  const initialStateJson = initialState
    ? JSON.stringify(initialState)
    : initialState;
  const valuesJson = values ? JSON.stringify(values) : values;
  const initialErrorStateJson = initialErrorState
    ? JSON.stringify(initialErrorState)
    : initialErrorState;

  const valid = Object.values(errors).every((error) => !error);

  const setValue = <K extends keyof T>(key: K, value: T[K]) => {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const setError = <K extends keyof V>(key: K, value: V[K]) => {
    setErrors((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetErrors = useCallback(
    () => setErrors(initialErrorState),
    [initialErrorState],
  );

  const reset = () => {
    setValues(initialState);
    resetErrors();
  };

  const validate = useCallback((): boolean => {
    if (validation?.validationCallback) {
      const newErrors = validation.validationCallback(values, {
        ...initialErrorState,
      });
      if (Object.values(newErrors).every((error) => !error)) {
        resetErrors();
        return true;
      }

      setErrors(newErrors);
      return false;
    }

    resetErrors();
    return true;
  }, [values, initialErrorState, validation, resetErrors]);

  const validateRef = useRef<typeof validate>();
  validateRef.current = validate;

  useEffect(() => {
    validateRef.current?.();
  }, [valuesJson, initialErrorStateJson]);

  useEffect(() => {
    if (initialStateJson) {
      setValues(JSON.parse(initialStateJson));
      setErrors(JSON.parse(initialErrorStateJson));
    }
  }, [initialStateJson, initialErrorStateJson]);

  return {
    values,
    errors,
    setValue,
    setValues,
    reset,
    setErrors,
    valid,
    setError,
    resetErrors,
    validate,
  };
}
