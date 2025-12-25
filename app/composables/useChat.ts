import type { ApiUser } from '~/composables/useApi'

export interface Conversation {
  id: number
  user1Id: number
  user2Id: number
  user1?: {
    id: number
    firstName: string
    lastName: string
    avatar?: string
  }
  user2?: {
    id: number
    firstName: string
    lastName: string
    avatar?: string
  }
  bookingId?: number | null
  isAdminChat: boolean
  unreadCountUser1: number
  unreadCountUser2: number
  lastMessageId?: number | null
  createdAt: string
  updatedAt: string
}

export interface Message {
  id: number
  conversationId: number
  senderId: number
  sender?: {
    id: number
    firstName: string
    lastName: string
    avatar?: string
  }
  content: string
  attachments?: string[] | null
  readAt?: string | null
  editedAt?: string | null
  deletedAt?: string | null
  isEdited: boolean
  createdAt: string
}

export interface MessagesResponse {
  data: Message[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export const useChat = () => {
  const api = useApi()

  const getConversations = async (): Promise<Conversation[]> => {
    return await api.request<Conversation[]>('/chat/conversations')
  }

  const getConversation = async (id: number): Promise<Conversation> => {
    return await api.request<Conversation>(`/chat/conversations/${id}`)
  }

  const createConversation = async (data: {
    userId: number
    bookingId?: number
  }): Promise<Conversation> => {
    return await api.request<Conversation>('/chat/conversations', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  const createAdminConversation = async (): Promise<Conversation> => {
    const response = await api.request<{ data?: Conversation; statusCode?: number } | Conversation>('/chat/conversations/admin', {
      method: 'POST',
    })
    
    if ('data' in response && response.data) {
      return response.data
    }
    
    return response as Conversation
  }

  const getMessages = async (
    conversationId: number,
    page = 1,
    limit = 50
  ): Promise<MessagesResponse> => {
    const response = await api.request<{ data?: MessagesResponse; statusCode?: number } | MessagesResponse>(
      `/chat/conversations/${conversationId}/messages?page=${page}&limit=${limit}`
    )
    
    if ('data' in response && response.data) {
      return response.data
    }
    
    return response as MessagesResponse
  }

  const sendMessage = async (data: {
    conversationId: number
    content: string
    attachments?: string[]
  }): Promise<Message> => {
    const response = await api.request<{ data?: Message; statusCode?: number } | Message>('/chat/messages', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    
    if ('data' in response && response.data) {
      return response.data
    }
    
    return response as Message
  }

  const uploadImage = async (
    conversationId: number,
    file: File
  ): Promise<{ message: Message; imageUrl: string }> => {
    const formData = new FormData()
    formData.append('image', file)

    const config = useRuntimeConfig()
    const apiBaseUrl = config.public.apiBaseUrl
    const auth = useAuth()
    const token = auth.getAuthToken()

    const response = await fetch(
      `${apiBaseUrl}/chat/conversations/${conversationId}/upload-image`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Ошибка загрузки изображения')
    }

    return await response.json()
  }

  return {
    getConversations,
    getConversation,
    createConversation,
    createAdminConversation,
    getMessages,
    sendMessage,
    uploadImage,
  }
}

