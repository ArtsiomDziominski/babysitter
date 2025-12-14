export interface Sitter {
  id: string
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
  isAvailable?: boolean
  advantages: string[]
}

export interface SearchForm {
  address: string
  date: string
  timeStart: string
  timeEnd: string
}

export interface SearchFilters {
  onlyAvailable: boolean
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
