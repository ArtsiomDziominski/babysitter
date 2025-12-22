import { useApi } from './useApi'

export interface CreateBookingRequest {
  babysitterId: number
  startTime: string
  endTime: string
  childrenCount: number
  childrenAges: number[]
  bookingType: 'offline' | 'online'
  childIsSick?: boolean
  hasSpecialNeedsChild?: boolean
  needsHelpWithHomework?: boolean
  needsOutdoorActivities?: boolean
  needsCarTransportation?: boolean
  needsWalking?: boolean
  notes?: string
}

export interface Booking {
  id: number
  parentId: number
  babysitterId: number
  startTime: string
  endTime: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  childrenCount: number
  childrenAges: number[]
  notes?: string
  totalPrice: number
  createdAt: string
  babysitter?: {
    id: number
    user: {
      firstName: string
      lastName: string
    }
  }
}

export interface BookingsListResponse {
  data: Booking[]
  meta: {
    page: number
    limit: number
    total: number
  }
}

export interface FetchBookingsParams {
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  page?: number
  limit?: number
}

export const useBookings = () => {
  const api = useApi()

  const createBooking = async (data: CreateBookingRequest): Promise<Booking> => {
    return await api.request<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  const getBookings = async (params?: FetchBookingsParams): Promise<BookingsListResponse> => {
    const queryParams = new URLSearchParams()

    if (params?.status) queryParams.append('status', params.status)
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())

    const queryString = queryParams.toString()
    const endpoint = `/bookings${queryString ? `?${queryString}` : ''}`

    return await api.request<BookingsListResponse>(endpoint, {
      method: 'GET',
    })
  }

  const getBookingById = async (id: number): Promise<Booking> => {
    return await api.request<Booking>(`/bookings/${id}`, {
      method: 'GET',
    })
  }

  return {
    createBooking,
    getBookings,
    getBookingById,
  }
}

