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
  access_token?: string
  /** Email ещё не подтверждён: токена нет, на почту отправлен код */
  requiresEmailVerification?: boolean
  email?: string
  requires2FA?: boolean
  tempToken?: string
  user?: {
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

  const verifyEmail = async (email: string, code: string): Promise<AuthResponseData> => {
    const response = await api.request<ApiAuthResponse>('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    })
    return response.data
  }

  const resendEmailVerification = async (email: string): Promise<void> => {
    await api.request('/auth/verify-email/resend', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  }

  const requestPasswordReset = async (email: string): Promise<void> => {
    await api.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  }

  const resetPassword = async (email: string, code: string, newPassword: string): Promise<AuthResponseData> => {
    const response = await api.request<ApiAuthResponse>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, code, newPassword }),
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
    verifyEmail,
    resendEmailVerification,
    requestPasswordReset,
    resetPassword,
    getProfile,
    getAuthToken,
  }
}

