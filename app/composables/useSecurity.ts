import { unwrapApiResponse } from './useApi'

interface ChangePasswordRequest {
  currentPassword: string
}

interface ChangePasswordRequestResponse {
  message: string
}

interface ChangePasswordConfirmRequest {
  code: string
  newPassword: string
}

interface ChangePasswordConfirmResponse {
  message: string
  // Старые токены отозваны бэкендом, сессию продолжает только этот токен
  access_token?: string
}

interface ChangeEmailRequest {
  newEmail: string
  currentPassword: string
}

interface ChangeEmailRequestResponse {
  message: string
}

interface ChangeEmailConfirmRequest {
  code: string
  newEmail: string
}

interface ChangeEmailConfirmResponse {
  message: string
}

export const useSecurity = () => {
  const requestPasswordChange = async (data: ChangePasswordRequest): Promise<ChangePasswordRequestResponse> => {
    const api = useApi()
    const response = await api.request<ChangePasswordRequestResponse | { data: ChangePasswordRequestResponse; statusCode: number }>('/auth/change-password/request', {
      method: 'POST',
      body: JSON.stringify(data)
    })
    return unwrapApiResponse(response)
  }

  const confirmPasswordChange = async (data: ChangePasswordConfirmRequest): Promise<ChangePasswordConfirmResponse> => {
    if (!data.code || !data.newPassword) {
      throw new Error('Код подтверждения и новый пароль обязательны')
    }
    
    if (data.newPassword.length < 8) {
      throw new Error('Пароль должен содержать минимум 8 символов')
    }

    const api = useApi()
    const response = await api.request<ChangePasswordConfirmResponse | { data: ChangePasswordConfirmResponse; statusCode: number }>('/auth/change-password/confirm', {
      method: 'POST',
      body: JSON.stringify(data)
    })
    return unwrapApiResponse(response)
  }

  const requestEmailChange = async (data: ChangeEmailRequest): Promise<ChangeEmailRequestResponse> => {
    const api = useApi()
    return await api.request<ChangeEmailRequestResponse>('/auth/change-email/request', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  const confirmEmailChange = async (data: ChangeEmailConfirmRequest): Promise<ChangeEmailConfirmResponse> => {
    const api = useApi()
    return await api.request<ChangeEmailConfirmResponse>('/auth/change-email/confirm', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  return {
    requestPasswordChange,
    confirmPasswordChange,
    requestEmailChange,
    confirmEmailChange
  }
}

