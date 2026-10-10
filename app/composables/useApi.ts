import { UserRole, type Role } from '~/const/roles'

interface ApiError {
  statusCode: number
  message: string
  error?: string
  details?: Array<{
    field: string
    message: string
  }>
}

export interface ApiUser {
  id: number
  email: string
  password?: string
  role?: Role
  firstName: string
  lastName: string
  phone?: string
  avatar?: string
  avatarUrl?: string
  twoFactorSecret?: string | null
  twoFactorEnabled?: boolean
  backupCodes?: string | null
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
  children?: any[]
}

/**
 * Бэкенд оборачивает каждый ответ в { data, statusCode }. Возвращает полезную нагрузку.
 */
export const unwrapApiResponse = <T>(response: T | { data: T; statusCode: number }): T => {
  if (response && typeof response === 'object' && 'statusCode' in response && 'data' in response) {
    return response.data
  }
  return response as T
}

export const useApi = () => {
  const config = useRuntimeConfig()
  const apiBaseUrl = config.public.apiBaseUrl

  const request = async <T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> => {
    const auth = useAuth()
    const token = auth.getAuthToken()
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    let response: Response
    try {
      response = await fetch(`${apiBaseUrl}${endpoint}`, {
        ...options,
        headers,
      })
    } catch {
      const error: ApiError = { statusCode: 0, message: 'Сервер недоступен. Проверьте подключение к интернету' }
      throw error
    }

    // Ответ может быть пустым (204) или HTML-страницей прокси (502) — не падаем на JSON.parse
    const data = response.status === 204 ? null : await response.json().catch(() => null)

    if (!response.ok) {
      // Ошибки валидации Nest приходят массивом сообщений
      const message = Array.isArray(data?.message) ? data.message.join(', ') : data?.message
      const error: ApiError = {
        statusCode: response.status,
        message: message || 'Произошла ошибка',
        error: data?.error,
        details: data?.details,
      }
      throw error
    }

    return data as T
  }

  return {
    request,
  }
}
