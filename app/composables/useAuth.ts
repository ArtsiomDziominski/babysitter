import type { ApiUser } from './useApi'
import { UserRole, type Role } from '~/const/roles'

interface LoginRequest {
  email: string
  password: string
}

interface RegisterRequest {
  email: string
  password: string
  role?: Role
  firstName: string
  lastName: string
  phone: string
}

interface AuthResponseData {
  access_token: string
  user: {
    id: number
    email: string
    role?: Role
    firstName: string
    lastName: string
  }
}

interface ApiAuthResponse {
  data: AuthResponseData
  statusCode: number
}

export const useAuth = () => {
  const api = useApi()

  const getAuthToken = (): string | null => {
    const tokenCookie = useCookie<string | null>('access_token')
    return tokenCookie.value
  }

  const login = async (credentials: LoginRequest): Promise<AuthResponseData> => {
    const response = await api.request<ApiAuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    return response.data
  }

  const register = async (data: RegisterRequest): Promise<AuthResponseData> => {
    const response = await api.request<ApiAuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return response.data
  }

  const getProfile = async (): Promise<{ data: ApiUser }> => {
    return await api.request<{ data: ApiUser }>('/users/profile', {
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

