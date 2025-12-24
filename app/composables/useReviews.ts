import { useApi } from './useApi'
import { UserRole } from '~/const/roles'

export interface CreateReviewRequest {
  bookingId: number
  targetId: number
  targetType: UserRole
  rating: number
  comment?: string
}

export interface Review {
  id: number
  bookingId: number
  authorId: number
  targetId: number
  targetType: UserRole
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
    const response = await api.request<{ targetType: string }[] | { data: { targetType: string }[]; statusCode: number }>(`/reviews/booking/${bookingId}`, {
      method: 'GET',
    })

    const reviews = Array.isArray(response) ? response : ('data' in response ? response.data : [])

    return reviews.map(review => ({
      ...review,
      targetType: review.targetType === 'parent' ? UserRole.PARENT : review.targetType === 'babysitter' ? UserRole.BABYSITTER : UserRole.PARENT
    })) as Review[]
  }

  interface GetReviewsParams {
    targetId?: number
    targetType?: 'babysitter' | 'parent'
    page?: number
    limit?: number
  }

  interface ReviewsListResponse {
    data: Review[]
    total: number
    page: number
    limit: number
    totalPages: number
  }

  const getReviews = async (params?: GetReviewsParams): Promise<ReviewsListResponse> => {
    const queryParams = new URLSearchParams()

    if (params?.targetId) queryParams.append('targetId', params.targetId.toString())
    if (params?.targetType) queryParams.append('targetType', params.targetType)
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())

    const queryString = queryParams.toString()
    const endpoint = `/reviews${queryString ? `?${queryString}` : ''}`

    const response = await api.request<ReviewsListResponse | { data: ReviewsListResponse; statusCode: number }>(endpoint, {
      method: 'GET',
    })

    const result = 'data' in response && 'statusCode' in response ? response.data : response as ReviewsListResponse

    return {
      ...result,
      data: result.data.map(review => ({
        ...review,
        targetType: review.targetType === 'parent' ? UserRole.PARENT : review.targetType === 'babysitter' ? UserRole.BABYSITTER : UserRole.PARENT
      })) as Review[]
    }
  }

  return {
    createReview,
    getReviewsByBookingId,
    getReviews,
  }
}

