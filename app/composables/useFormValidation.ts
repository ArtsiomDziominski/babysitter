import * as z from 'zod'
import type { FormErrorEvent } from '@nuxt/ui'

/** Общие правила для форм: пустое поле → «Обязательное поле», а не ошибка формата. */
export const useFormValidation = () => {
  const { t } = useI18n()

  const requiredString = (options: { trim?: boolean } = {}) => {
    const base = z.string({ error: () => t('validation.required') })
    return (options.trim === false ? base : base.trim())
      .min(1, { error: () => t('validation.required'), abort: true })
  }

  const email = () => requiredString().pipe(z.email({ error: () => t('validation.email') }))

  const password = () => requiredString({ trim: false })
    .min(8, { error: () => t('auth.passwordMinLength') })

  /** Ставит фокус на первое поле с ошибкой и прокручивает к нему. */
  const focusFirstError = (event: FormErrorEvent) => {
    const id = event.errors[0]?.id
    if (!id) return
    const element = document.getElementById(id)
    element?.focus()
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return { requiredString, email, password, focusFirstError }
}
