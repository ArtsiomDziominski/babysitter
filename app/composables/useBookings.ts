import { useApi } from './useApi'

export interface BookingChild {
  name: string
  age: number
  description?: string
}

export interface CreateBookingRequest {
  babysitterId: number
  startTime: string
  endTime: string
  childrenCount?: number
  children?: BookingChild[]
  childrenAges?: number[]
  bookingType: 'offline' | 'online'
  childIsSick?: boolean
  hasSpecialNeedsChild?: boolean
  needsHelpWithHomework?: boolean
  needsOutdoorActivities?: boolean
  needsCarTransportation?: boolean
  needsWalking?: boolean
  notes?: string
}

export interface BookingListItem {
  id: number
  customer: {
    name: string
    phone: string
  }
  date: string
  time: string
  children: string[] | BookingChild[]
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  totalPrice: string | number
  startTime: string
  endTime: string
  childrenCount: number
  childrenAges?: string[] | number[] | null
  bookingType: 'offline' | 'online'
  childIsSick: boolean
  hasSpecialNeedsChild: boolean
  needsHelpWithHomework: boolean
  needsOutdoorActivities: boolean
  needsCarTransportation: boolean
  needsWalking: boolean
  notes?: string
  createdAt: string
  babysitterId?: number
  parentReviewId?: number | null
  babysitterReviewId?: number | null
}

export interface BookingDetails {
  id: number
  parentId: number
  babysitterId: number
  startTime: string
  endTime: string
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  childrenCount: number
  childrenAges?: string[] | number[] | null
  children?: BookingChild[]
  bookingType: 'offline' | 'online'
  childIsSick: boolean
  hasSpecialNeedsChild: boolean
  needsHelpWithHomework: boolean
  needsOutdoorActivities: boolean
  needsCarTransportation: boolean
  needsWalking: boolean
  notes?: string
  totalPrice: string | number
  createdAt: string
  updatedAt?: string
  parent?: {
    id: number
    firstName?: string
    lastName?: string
    user?: {
      firstName: string
      lastName: string
    }
  }
  babysitter?: {
    id: number
    user: {
      id: number
      firstName: string
      lastName: string
    }
  }
  parentReviewId?: number | null
  babysitterReviewId?: number | null
}

export interface Booking extends BookingListItem {}

export interface BookingsListResponse {
  data: BookingListItem[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface BookingsListApiResponse {
  data: BookingsListResponse
  statusCode: number
}

export interface FetchBookingsParams {
  status?: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
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

    const response = await api.request<BookingsListApiResponse | BookingsListResponse>(endpoint, {
      method: 'GET',
    })

    if ('data' in response && 'statusCode' in response) {
      return response.data
    }

    return response as BookingsListResponse
  }

  const getBookingById = async (id: number): Promise<BookingDetails> => {
    const response = await api.request<BookingDetails | { data: BookingDetails; statusCode: number }>(`/bookings/${id}`, {
      method: 'GET',
    })

    console.log('Ответ getBookingById:', response)

    if ('data' in response && 'statusCode' in response) {
      return response.data
    }

    return response as BookingDetails
  }

  const updateBookingStatus = async (id: number, status: 'confirmed' | 'cancelled'): Promise<BookingDetails> => {
    const response = await api.request<BookingDetails | { data: BookingDetails; statusCode: number }>(`/bookings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })

    if ('data' in response && 'statusCode' in response) {
      return response.data
    }

    return response as BookingDetails
  }

  return {
    createBooking,
    getBookings,
    getBookingById,
    updateBookingStatus,
  }
}

