import { useApi } from './useApi'
import type { ScheduleMode } from '~/const/schedule'

export type { ScheduleMode }

export interface TimeInterval {
  startTime: string
  endTime: string
}

export interface BabysitterSchedule {
  dayOfWeek?: number
  date?: string
  intervals: TimeInterval[]
  isRecurring?: boolean
}

export interface BabysitterScheduleBlock {
  mode: ScheduleMode
  schedules: BabysitterSchedule[]
  isRecurring?: boolean
}

export interface BabysitterProfilePayload {
  id?: number
  experience?: number | null
  firstName?: string | null
  lastName?: string | null
  certifications?: string[]
  bio?: string | null
  cardPaymentAvailable?: boolean
  minOrderAmount?: string | null
  priceOneChild?: string | null
  priceTwoChildren?: string | null
  priceThreeChildren?: string | null
  priceFourChildren?: string | null
  priceFiveChildren?: string | null
  onlineLesson?: string | null
  cancellationPolicy?: string | null
  infantCare?: boolean
  specialNeedsCare?: boolean
  petAttitude?: string | null
  advantages?: string[]
  birthDate?: string | null
  showInSearch?: boolean
  schedules?: BabysitterScheduleBlock[]
}

export interface BabysitterListItem {
  id: number
  userId: number
  firstName: string
  lastName: string
  age?: number
  experience?: number
  certifications?: string[]
  bio?: string
  cardPaymentAvailable?: boolean
  minOrderAmount?: string
  priceOneChild?: string
  priceTwoChildren?: string
  priceThreeChildren?: string
  priceFourChildren?: string
  priceFiveChildren?: string
  onlineLesson?: string
  cancellationPolicy?: string
  infantCare?: boolean
  specialNeedsCare?: boolean
  petAttitude?: string
  advantages?: string[]
  birthDate?: string
  rating?: string
  reviewsCount?: number
  showInSearch?: boolean
  available?: boolean
  isOnline?: boolean
  hourlyRate?: number | null
  createdAt?: string
  updatedAt?: string
}

export interface BabysittersListResponse {
  data: {
    data: BabysitterListItem[]
    meta: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
  statusCode: number
}

export interface FetchBabysittersParams {
  page?: number
  limit?: number
  minAge?: number
  maxAge?: number
  minRate?: number
  maxRate?: number
  search?: string
}

export const useBabysitter = () => {
  const api = useApi()

  const fetchMyBabysitter = async (): Promise<BabysitterProfilePayload | null> => {
      const response =  await api.request<{ data: BabysitterProfilePayload | null }>('/babysitters/profile', {
        method: 'GET',
    })

      return response.data
  }

  const createBabysitter = async (data: BabysitterProfilePayload): Promise<BabysitterProfilePayload> => {
    return await api.request<BabysitterProfilePayload>('/babysitters', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  const updateBabysitter = async (data: BabysitterProfilePayload): Promise<BabysitterProfilePayload> => {
    return await api.request<BabysitterProfilePayload>('/babysitters', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  const deleteBabysitter = async (): Promise<void> => {
    return await api.request<void>('/babysitters', {
      method: 'DELETE',
    })
  }

  const toggleSearchVisibility = async (showInSearch: boolean): Promise<BabysitterProfilePayload> => {
    return await api.request<BabysitterProfilePayload>('/babysitters/search-visibility', {
      method: 'PATCH',
      body: JSON.stringify({ showInSearch }),
    })
  }

  const fetchBabysitters = async (params?: FetchBabysittersParams): Promise<BabysittersListResponse> => {
    const queryParams = new URLSearchParams()

    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.minAge) queryParams.append('minAge', params.minAge.toString())
    if (params?.maxAge) queryParams.append('maxAge', params.maxAge.toString())
    if (params?.minRate) queryParams.append('minRate', params.minRate.toString())
    if (params?.maxRate) queryParams.append('maxRate', params.maxRate.toString())
    if (params?.search) queryParams.append('search', params.search)

    const queryString = queryParams.toString()
    const endpoint = `/babysitters${queryString ? `?${queryString}` : ''}`

    return await api.request<BabysittersListResponse>(endpoint, {
        method: 'GET',
    })
  }

  return {
    fetchMyBabysitter,
    createBabysitter,
    updateBabysitter,
    deleteBabysitter,
    toggleSearchVisibility,
    fetchBabysitters,
  }
}

