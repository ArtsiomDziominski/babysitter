export interface Sitter {
  id: string
  userId?: number
  name: string
  avatar?: string
  rating: number
  orders: number
  hours: number
  price: number
  description: string
  tags: string[]
  isNew?: boolean
  isOnline?: boolean
  lastSeenOnline?: string
  isAvailable?: boolean
  showInSearch?: boolean
  advantages: string[]
  age?: number
  registeredAt?: string
  detailedDescription?: string
  education?: string
  experience?: string
  preferences?: string
  responseTime?: string
  returningCount?: number
  reviews?: Review[]
  paymentMethods?: string[]
  schedule?: ScheduleSlot[]
  workConditions?: string
  safetyInfo?: string
  priceOneChild?: string
  priceTwoChildren?: string
  priceThreeChildren?: string
  onlineLesson?: string
  minOrderAmount?: string
  petAttitude?: string
}

export interface Review {
  id: string
  author: string
  rating: number
  text: string
  date: string
}

export interface ScheduleSlot {
  day: string
  timeSlots: string[]
  dayOfWeek?: number
  date?: string
  isRecurring?: boolean
}

export interface SearchForm {
  address: string
  date: string
  timeStart: string
  timeEnd: string
}

export interface SearchFilters {
  onlyOnline: boolean
  priceMin?: number
  priceMax?: number
  childrenCount?: number
  advantages: {
    kidsoutSchool: boolean
    infants: boolean
    specialNeeds: boolean
    homework: boolean
    french: boolean
    music: boolean
    active: boolean
    english: boolean
    driver: boolean
    medical: boolean
    firstAid: boolean
  }
}
