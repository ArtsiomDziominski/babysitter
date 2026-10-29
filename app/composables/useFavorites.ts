import { useApi, unwrapApiResponse } from './useApi'
import type { BabysitterListItem } from './useBabysitter'

/** Избранные няни: id хранятся в общем состоянии, чтобы сердечки на всех страницах совпадали. */
export const useFavorites = () => {
  const api = useApi()
  const authStore = useAuthStore()
  const ids = useState<number[]>('favorite-ids', () => [])
  // Для какого пользователя загружены id: после смены аккаунта список перечитывается
  const loadedFor = useState<number | null>('favorite-ids-user', () => null)

  const isFavorite = (babysitterId: number | string) => ids.value.includes(Number(babysitterId))

  const loadIds = async (force = false) => {
    const userId = authStore.currentUser?.id ?? null
    if (!authStore.isAuthenticated || !userId) {
      ids.value = []
      loadedFor.value = null
      return
    }
    if (loadedFor.value === userId && !force) return
    loadedFor.value = userId
    try {
      const response = await api.request<number[] | { data: number[]; statusCode: number }>('/favorites/ids', { method: 'GET' })
      ids.value = unwrapApiResponse(response)
    } catch (error) {
      loadedFor.value = null
      throw error
    }
  }

  const fetchFavorites = async (): Promise<BabysitterListItem[]> => {
    const response = await api.request<BabysitterListItem[] | { data: BabysitterListItem[]; statusCode: number }>('/favorites', { method: 'GET' })
    return unwrapApiResponse(response)
  }

  /** Оптимистично переключает сердечко и откатывает при ошибке. Возвращает новое состояние. */
  const toggleFavorite = async (babysitterId: number | string): Promise<boolean> => {
    const id = Number(babysitterId)
    const wasFavorite = isFavorite(id)
    ids.value = wasFavorite ? ids.value.filter(item => item !== id) : [id, ...ids.value]
    try {
      await api.request<void>(`/favorites/${id}`, { method: wasFavorite ? 'DELETE' : 'PUT' })
      return !wasFavorite
    } catch (error) {
      ids.value = wasFavorite ? [id, ...ids.value] : ids.value.filter(item => item !== id)
      throw error
    }
  }

  return {
    ids,
    isFavorite,
    loadIds,
    fetchFavorites,
    toggleFavorite,
  }
}
