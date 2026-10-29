import * as z from 'zod'

// Переведённые сообщения zod по умолчанию: вместо «Invalid input» пользователь видит
// понятный текст на своём языке. Сообщения, заданные в самой схеме, имеют приоритет.
export default defineNuxtPlugin((nuxtApp) => {
  const i18n = nuxtApp.$i18n as { t: (key: string, params?: Record<string, unknown>) => string }
  const t = (key: string, params?: Record<string, unknown>) => i18n.t(key, params ?? {})

  z.config({
    customError: (issue) => {
      switch (issue.code) {
        case 'invalid_type':
          return issue.input === undefined || issue.input === null || issue.input === ''
            ? t('validation.required')
            : t('validation.invalid')
        case 'too_small':
          if (issue.origin === 'string') {
            return Number(issue.minimum) <= 1
              ? t('validation.required')
              : t('validation.minLength', { min: Number(issue.minimum) })
          }
          return t('validation.invalid')
        case 'too_big':
          return issue.origin === 'string'
            ? t('validation.maxLength', { max: Number(issue.maximum) })
            : t('validation.invalid')
        case 'invalid_format':
          return issue.format === 'email' ? t('validation.email') : t('validation.invalid')
        default:
          return t('validation.invalid')
      }
    }
  })
})
