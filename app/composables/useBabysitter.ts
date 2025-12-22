import { useApi } from './useApi'
import { ScheduleMode } from '~/const/schedule'
import type { Sitter, ScheduleSlot } from '~/types/sitter'

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

export interface BabysitterDetailResponse {
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
  rating?: number
  reviewsCount?: number
  available?: boolean
  showInSearch?: boolean
  isOnline?: boolean
  schedules?: BabysitterScheduleBlock[]
  returningClients?: number
  responseTime?: string
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

  const fetchBabysitterById = async (id: number): Promise<BabysitterDetailResponse> => {
    const response = await api.request<BabysitterDetailResponse | { data: BabysitterDetailResponse }>(`/babysitters/${id}`, {
      method: 'GET',
    })
    
    if ('data' in response && response.data) {
      return response.data
    }
    
    return response as BabysitterDetailResponse
  }

  return {
    fetchMyBabysitter,
    createBabysitter,
    updateBabysitter,
    deleteBabysitter,
    toggleSearchVisibility,
    fetchBabysitters,
    fetchBabysitterById,
  }
}

const dayNames = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']

export const mapBabysitterToSitter = (data: BabysitterDetailResponse | null | undefined): Sitter => {
  if (!data) {
    throw new Error('Данные ситтера отсутствуют')
  }
  
  const schedule: ScheduleSlot[] = []
  
  if (data.schedules) {
    for (const block of data.schedules) {
      if (block.mode === ScheduleMode.WEEKLY) {
        for (const scheduleItem of block.schedules) {
          if (scheduleItem.dayOfWeek !== undefined) {
            const dayName = dayNames[scheduleItem.dayOfWeek] || `День ${scheduleItem.dayOfWeek}`
            const timeSlots = scheduleItem.intervals.map(
              interval => `${interval.startTime} - ${interval.endTime}`
            )
            schedule.push({ 
              day: dayName, 
              timeSlots,
              dayOfWeek: scheduleItem.dayOfWeek,
              isRecurring: scheduleItem.isRecurring || block.isRecurring
            })
          }
        }
      } else if (block.mode === ScheduleMode.ALL_DAYS) {
        for (const scheduleItem of block.schedules) {
          const timeSlots = scheduleItem.intervals.map(
            interval => `${interval.startTime} - ${interval.endTime}`
          )
          schedule.push({ 
            day: 'Все дни', 
            timeSlots,
            isRecurring: scheduleItem.isRecurring || block.isRecurring
          })
        }
      } else if (block.mode === ScheduleMode.EVERYDAY) {
        for (const scheduleItem of block.schedules) {
          if (scheduleItem.date) {
            const date = new Date(scheduleItem.date)
            const dayName = date.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })
            const timeSlots = scheduleItem.intervals.map(
              interval => `${interval.startTime} - ${interval.endTime}`
            )
            schedule.push({ 
              day: dayName, 
              timeSlots,
              date: scheduleItem.date,
              isRecurring: scheduleItem.isRecurring || block.isRecurring
            })
          }
        }
      }
    }
  }

  const paymentMethods: string[] = []
  if (data.cardPaymentAvailable) {
    paymentMethods.push('Банковская карта')
  }
  paymentMethods.push('Наличные')

  const calculateAge = (birthDate?: string): number | undefined => {
    if (!birthDate) return data.age
    try {
      const birth = new Date(birthDate)
      if (isNaN(birth.getTime())) return data.age
      const today = new Date()
      let age = today.getFullYear() - birth.getFullYear()
      const monthDiff = today.getMonth() - birth.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--
      }
      return age
    } catch {
      return data.age
    }
  }

  return {
    id: data.id?.toString() || '0',
    name: `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Без имени',
    rating: data.rating || 0,
    orders: data.reviewsCount || 0,
    hours: 0,
    price: data.priceOneChild ? parseFloat(data.priceOneChild) : 0,
    description: data.bio || '',
    tags: data.certifications || [],
    isOnline: data.isOnline,
    isAvailable: data.available,
    advantages: data.advantages || [],
    age: calculateAge(data.birthDate),
    registeredAt: data.createdAt || data.updatedAt,
    detailedDescription: data.bio,
    experience: data.experience?.toString(),
    workConditions: data.cancellationPolicy,
    schedule: schedule.length > 0 ? schedule : undefined,
    paymentMethods: paymentMethods.length > 0 ? paymentMethods : undefined,
    priceOneChild: data.priceOneChild,
    priceTwoChildren: data.priceTwoChildren,
    priceThreeChildren: data.priceThreeChildren,
    onlineLesson: data.onlineLesson,
    minOrderAmount: data.minOrderAmount,
    returningClients: data.returningClients,
    responseTime: data.responseTime,
  }
}

