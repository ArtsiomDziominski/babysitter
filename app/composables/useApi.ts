interface ApiError {
  statusCode: number
  message: string
  error?: string
  details?: Array<{
    field: string
    message: string
  }>
}

interface LoginRequest {
  email: string
  password: string
}

interface RegisterRequest {
  email: string
  password: string
  role: 'parent' | 'babysitter'
  firstName: string
  lastName: string
  phone: string
}

interface AuthResponseData {
  access_token: string
  user: {
    id: number
    email: string
    role: 'parent' | 'babysitter'
    firstName: string
    lastName: string
  }
}

export interface ApiUser {
  id: number
  email: string
  password?: string
  role: 'parent' | 'babysitter'
  firstName: string
  lastName: string
  phone?: string
  twoFactorSecret?: string | null
  twoFactorEnabled?: boolean
  backupCodes?: string | null
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
  babysitter?: any | null
  children?: any[]
}

export const useApi = () => {
  const config = useRuntimeConfig()
  const apiBaseUrl = config.public.apiBaseUrl

  const getAuthToken = (): string | null => {
    const tokenCookie = useCookie<string | null>('access_token')
    return tokenCookie.value
  }

  const request = async <T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> => {
    const token = getAuthToken()
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
        throw {
          statusCode: response.status,
          message: data.message || 'Произошла ошибка',
          error: data.error,
          details: data.details,
      }
    }

    return data?.data || data as T
  }

  const login = async (credentials: LoginRequest): Promise<AuthResponseData> => {
      return await request<AuthResponseData>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
    })
  }

  const register = async (data: RegisterRequest): Promise<AuthResponseData> => {
      return await request<AuthResponseData>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
    })
  }

  const getProfile = async (): Promise<ApiUser> => {
      return await request<ApiUser>('/users/profile', {
        method: 'GET',
    })
  }

  return {
    login,
    register,
    getProfile,
    getAuthToken,
  }
}
