// hooks/useForm.ts
import { useState, useCallback, useMemo } from "react"

interface UseFormOptions<T> {
  initialValues: T
  validate?: (values: T) => Partial<Record<keyof T, string>>
  onSubmit: (values: T) => void | Promise<void>
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validate,
  onSubmit,
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = useCallback((field: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }))
    
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }, [errors])

  const handleBlur = useCallback((field: keyof T) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }, [])

  const handleSubmit = useCallback(async () => {
    const allTouched = Object.keys(values).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    )
    setTouched(allTouched)


    const validationErrors = validate ? validate(values) : {}
    setErrors(validationErrors)


    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true)
      try {
        await onSubmit(values)
      } catch (error) {
        console.error("Form submission error:", error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }, [values, validate, onSubmit])

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }, [initialValues])

  const isValid = useMemo(() => {
    const validationErrors = validate ? validate(values) : {}
    return Object.keys(validationErrors).length === 0
  }, [values, validate])

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setValues,
  }
}