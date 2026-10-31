import type { BabysitterProfilePayload } from './useBabysitter'
import { isCityCenter } from '~/const/cities'

const DISMISS_KEY = 'sitterLocationReminderDismissedUntil'
const DISMISS_DAYS = 7

/** Анкета есть, но точка не отмечена или стоит в центре города, куда её поставил бэк. */
export const needsLocation = (profile?: BabysitterProfilePayload | null) => {
  if (!profile) return false
  const { latitude, longitude } = profile
  if (latitude == null || longitude == null) return true
  return isCityCenter(profile.city, Number(latitude), Number(longitude))
}

/** Напоминание няне отметить свой район на карте: показывается в кабинете, пока точка не уточнена. */
export const useSitterLocationReminder = () => {
  const needs = useState('sitterNeedsLocation', () => false)
  const dismissed = useState('sitterLocationReminderDismissed', () => false)

  const update = (profile?: BabysitterProfilePayload | null) => {
    needs.value = needsLocation(profile)
  }

  const check = async () => {
    try {
      const until = Number(localStorage.getItem(DISMISS_KEY) || 0)
      dismissed.value = until > Date.now()
    } catch {
      dismissed.value = false
    }
    try {
      update(await useBabysitter().fetchMyBabysitter())
    } catch {
      // анкеты ещё нет (404) или сеть: напоминать не о чем
      needs.value = false
    }
  }

  const dismiss = () => {
    dismissed.value = true
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now() + DISMISS_DAYS * 24 * 60 * 60 * 1000))
    } catch {
      // без localStorage баннер вернётся при следующем заходе
    }
  }

  const isVisible = computed(() => needs.value && !dismissed.value)

  return { isVisible, check, update, dismiss }
}
