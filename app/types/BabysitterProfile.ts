import type { BabysitterScheduleBlock } from '~/composables/useBabysitter'

export interface BabysitterProfileResponse {
  id: number
  userId: number
  birthDate?: string | null
  experience?: number | null
  hourlyRate?: number
  certifications?: string[]
  bio?: string | null
  rating?: number
  reviewsCount?: number
  available?: boolean
  showInSearch?: boolean
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
  user?: {
    firstName?: string
    lastName?: string
  }
  schedules?: BabysitterScheduleBlock[]
}

