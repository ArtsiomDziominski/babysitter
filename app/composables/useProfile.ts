import type { ApiUser } from './useApi'
import { UserRole } from '~/const/roles'

interface UpdateProfileRequest {
  firstName: string
  lastName: string
  phone: string
}

export const useProfile = () => {
  const api = useApi()
  const auth = useAuth()
  const config = useRuntimeConfig()
  const apiBaseUrl = config.public.apiBaseUrl

  const updateProfile = async (data: UpdateProfileRequest): Promise<ApiUser> => {
    return await api.request<ApiUser>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  const updateRole = async (role: UserRole): Promise<ApiUser> => {
    return await api.request<ApiUser>('/users/profile/role', {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    })
  }

  const uploadAvatar = async (file: File): Promise<ApiUser> => {
    const token = auth.getAuthToken()
    const formData = new FormData()
    formData.append('avatar', file)

    const headers: Record<string, string> = {}
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${apiBaseUrl}/users/profile/avatar`, {
      method: 'POST',
      headers,
      body: formData,
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

    return data as ApiUser
  }

  const deleteAvatar = async (): Promise<ApiUser> => {
    return await api.request<ApiUser>('/users/profile/avatar', {
      method: 'DELETE',
    })
  }

  const getAvatarUrl = async (token?: string | null): Promise<string | null> => {
    const authToken = token ?? auth.getAuthToken()

    const headers: Record<string, string> = {}
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`
    }

    const response = await fetch(`${apiBaseUrl}/users/profile/avatar`, {
      method: 'GET',
      headers,
      redirect: 'follow',
    })

    if (response.status === 404) {
      return null
    }

    if (!response.ok) {
      throw {
        statusCode: response.status,
        message: 'Ошибка при получении аватара',
        error: 'Error',
      }
    }

    return response.url
  }

  return {
    updateProfile,
    updateRole,
    uploadAvatar,
    deleteAvatar,
    getAvatarUrl,
  }
}

