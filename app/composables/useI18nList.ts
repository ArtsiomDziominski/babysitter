/**
 * Возвращает массив строк из перевода-массива (например, pages.becomeBabysitter.benefits).
 * tm/rt учитывают fallbackLocale, в отличие от ручного обхода $i18n.messages.
 */
export const useI18nList = (key: MaybeRefOrGetter<string>) => {
  const { tm, rt } = useI18n()

  return computed<string[]>(() => {
    const value = tm(toValue(key))
    if (!Array.isArray(value)) return []
    return value.map(item => (typeof item === 'string' ? item : rt(item)))
  })
}
