export interface Child {
  id?: number
  parentId?: number
  name: string
  age?: number | null
  dateOfBirth?: string | null
  gender?: string
  allergies?: string | null
  specialNeeds?: string | null
  notes?: string | null
  createdAt?: string
  updatedAt?: string
}

interface CreateChildRequest {
  name: string
  age?: number
  dateOfBirth?: string
  specialNeeds?: string | null
  allergies?: string | null
  notes?: string | null
}

interface UpdateChildRequest {
  name?: string
  age?: number
  allergies?: string | null
  specialNeeds?: string | null
  notes?: string | null
}

export const useChildren = () => {
  const api = useApi()

  const createChild = async (data: CreateChildRequest): Promise<Child> => {
    return await api.request<Child>('/children', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  const deleteChild = async (id: number): Promise<{ message: string }> => {
    return await api.request<{ message: string }>(`/children/${id}`, {
      method: 'DELETE',
    })
  }

  const getChildren = async (): Promise<{ data: Child[] }> => {
    return await api.request<{ data: Child[] }>('/children', {
      method: 'GET',
    })
  }

  const updateChild = async (id: number, data: UpdateChildRequest): Promise<Child> => {
    return await api.request<Child>(`/children/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  return {
    createChild,
    deleteChild,
    getChildren,
    updateChild,
  }
}

