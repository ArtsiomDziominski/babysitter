import { ADVANTAGE_KEYS, AdvantageKey } from '~/const/advantages'

export const useAdvantages = () => {
  const { t } = useI18n()

  const getAdvantageTranslation = (key: string): string => {
    return t(`bookings.filters.advantages.additional.${key}`)
  }

  const getAdvantageKey = (translatedText: string): string | null => {
    for (const key of ADVANTAGE_KEYS) {
      const translation = t(`bookings.filters.advantages.additional.${key}`)
      if (translation === translatedText) {
        return key
      }
    }
    return null
  }

  const convertAdvantagesToKeys = (advantages: string[]): string[] => {
    return advantages
      .map(adv => {
        const key = getAdvantageKey(adv)
        return key || adv
      })
      .filter(Boolean) as string[]
  }

  const convertKeysToTranslations = (keys: string[]): string[] => {
    return keys.map(key => getAdvantageTranslation(key))
  }

  const getDisplayedAdvantages = (advantages?: string[]): string[] => {
    if (!advantages?.length) return []
    const keys = convertAdvantagesToKeys(advantages)
    return convertKeysToTranslations(keys)
  }

  return {
    getAdvantageTranslation,
    getAdvantageKey,
    convertAdvantagesToKeys,
    convertKeysToTranslations,
    getDisplayedAdvantages
  }
}

