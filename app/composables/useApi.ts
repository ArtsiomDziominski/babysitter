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
  twoFactorSecret?: string | null
  twoFactorEnabled?: boolean
  backupCodes?: string | null
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
  children?: any[]
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

    const response = await fetch(`${apiBaseUrl}${endpoint}`, {
      ...options,
      headers,
    })

    const data = await response.json()

    if (!response.ok) {
      const error: ApiError = {
        statusCode: response.status,
        message: data.message || 'Произошла ошибка',
        error: data.error,
        details: data.details,
      }
      throw error
    }

    return data as T
  }

  return {
    request,
  }
}
