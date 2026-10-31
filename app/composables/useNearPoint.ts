const STORAGE_KEY = 'searchNearPoint'

export type NearPoint = [number, number]

/**
 * Точка родителя для «Ближе ко мне»: из геолокации или отмеченная на карте.
 * Живёт только в браузере (localStorage), на бэк уходит в запросе поиска с точностью ~100 м.
 */
export const useNearPoint = () => {
  const point = useState<NearPoint | null>('nearPoint', () => null)
  const restored = useState('nearPointRestored', () => false)

  if (import.meta.client && !restored.value) {
    restored.value = true
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
      if (Array.isArray(saved) && saved.length === 2 && saved.every(Number.isFinite)) {
        point.value = saved as NearPoint
      }
    } catch {
      // повреждённое значение просто игнорируем
    }
  }

  const setPoint = (value: NearPoint | null) => {
    point.value = value ? [Number(value[0].toFixed(3)), Number(value[1].toFixed(3))] : null
    try {
      if (point.value) localStorage.setItem(STORAGE_KEY, JSON.stringify(point.value))
      else localStorage.removeItem(STORAGE_KEY)
    } catch {
      // приватный режим: точка просто не переживёт перезагрузку
    }
  }

  /** Геолокация браузера; false — пользователь запретил доступ или устройство не смогло определить место. */
  const locate = () => new Promise<boolean>((resolve) => {
    if (!import.meta.client || !navigator.geolocation) return resolve(false)
    navigator.geolocation.getCurrentPosition(
        (position) => {
          setPoint([position.coords.latitude, position.coords.longitude])
          resolve(true)
        },
        () => resolve(false),
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 5 * 60 * 1000 },
    )
  })

  return { point: computed(() => point.value), setPoint, locate }
}
