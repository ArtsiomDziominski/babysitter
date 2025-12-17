import { useApi } from './useApi'
import { useAuth } from './useAuth'

export type ScheduleMode = 'weekly' | 'everyday' | 'allDays'

export interface TimeInterval {
  startTime: string
  endTime: string
}

export interface BabysitterSchedule {
  dayOfWeek?: number
  date?: string
  intervals: TimeInterval[]
}

export interface BabysitterScheduleBlock {
  mode: ScheduleMode
  schedules: BabysitterSchedule[]
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
  schedules?: BabysitterScheduleBlock[]
}

export const useBabysitter = () => {
  const api = useApi()
  const auth = useAuth()

  const fetchMyBabysitter = async (): Promise<BabysitterProfilePayload | null> => {
    const profile = await auth.getProfile()
    return (profile.data as any).babysitter ?? null
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

  return {
    fetchMyBabysitter,
    createBabysitter,
    updateBabysitter,
  }
}

