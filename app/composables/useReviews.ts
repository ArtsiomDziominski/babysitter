import { useApi } from './useApi'

export interface CreateReviewRequest {
  bookingId: number
  targetId: number
  targetType: 'babysitter' | 'parent'
  rating: number
  comment?: string
}

export interface Review {
  id: number
  bookingId: number
  authorId: number
  targetId: number
  targetType: 'babysitter' | 'parent'
  rating: number
  comment?: string
  createdAt: string
  updatedAt: string
  author: {
    id: number
    firstName: string
    lastName: string
    avatar?: string
  }
  target: {
    id: number
    firstName: string
    lastName: string
  }
}

export const useReviews = () => {
  const api = useApi()

  const createReview = async (data: CreateReviewRequest): Promise<Review> => {
    return await api.request<Review>('/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  const getReviewsByBookingId = async (bookingId: number): Promise<Review[]> => {
    const response = await api.request<Review[] | { data: Review[]; statusCode: number }>(`/reviews/booking/${bookingId}`, {
      method: 'GET',
    })

    if (Array.isArray(response)) {
      return response
    }

    if ('data' in response) {
      return response.data
    }

    return []
  }

  return {
    createReview,
    getReviewsByBookingId,
  }
}

