export interface TrustedContact {
  id?: number
  parentId?: number
  firstName: string
  lastName: string
  phone: string
  relationship?: string | null
  createdAt?: string
  updatedAt?: string
}

interface CreateTrustedContactRequest {
  firstName: string
  lastName: string
  phone: string
  relationship?: string
}

interface UpdateTrustedContactRequest {
  firstName?: string
  lastName?: string
  phone?: string
  relationship?: string | null
}

export const useTrustedContacts = () => {
  const api = useApi()

  const getTrustedContacts = async (): Promise<TrustedContact[]> => {
      const response = await api.request<{ data: TrustedContact[] }>('/users/trusted-contacts', {
      method: 'GET',
    })
      return response.data
  }

  const createTrustedContact = async (data: CreateTrustedContactRequest): Promise<TrustedContact> => {
    return await api.request<TrustedContact>('/users/trusted-contacts', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  const updateTrustedContact = async (id: number, data: UpdateTrustedContactRequest): Promise<TrustedContact> => {
    return await api.request<TrustedContact>(`/users/trusted-contacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  const deleteTrustedContact = async (id: number): Promise<{ message: string }> => {
    return await api.request<{ message: string }>(`/users/trusted-contacts/${id}`, {
      method: 'DELETE',
    })
  }

  return {
    getTrustedContacts,
    createTrustedContact,
    updateTrustedContact,
    deleteTrustedContact,
  }
}

