import type { Sitter } from '~/types/sitter'

export const useBookingPrice = () => {
  const calculatePrice = (
    sitter: Sitter | null,
    bookingType: 'offline' | 'online',
    childrenCount: number,
    startDate: string,
    startTime: string,
    endDate: string,
    endTime: string
  ): number | null => {
    if (!sitter || !childrenCount || !startDate || !startTime || !endDate || !endTime) {
      return null
    }

    try {
      const start = new Date(`${startDate}T${startTime}`)
      const end = new Date(`${endDate}T${endTime}`)
      const hours = Math.max(0, (end.getTime() - start.getTime()) / (1000 * 60 * 60))

      if (hours <= 0) return null

      let pricePerHour = 0

      if (bookingType === 'online') {
        if (sitter.onlineLesson) {
          const parsed = parseFloat(sitter.onlineLesson)
          if (!isNaN(parsed) && isFinite(parsed) && parsed > 0) {
            pricePerHour = parsed
          }
        }
      } else {
        // Цена за час зависит от количества детей (как и на бэкенде)
        const priceByChildrenCount = [
          sitter.priceOneChild,
          sitter.priceTwoChildren,
          sitter.priceThreeChildren,
          sitter.priceFourChildren,
          sitter.priceFiveChildren
        ]
        const parsed = parseFloat(priceByChildrenCount[childrenCount - 1] ?? '')
        if (!isNaN(parsed) && isFinite(parsed) && parsed > 0) {
          pricePerHour = parsed
        }

        if (pricePerHour === 0 && sitter.price) {
          pricePerHour = sitter.price
        }
      }

      if (pricePerHour > 0 && isFinite(pricePerHour)) {
        return Math.round(pricePerHour * hours)
      }
    } catch (e) {
      console.error('Ошибка расчета цены:', e)
    }

    return null
  }

  return {
    calculatePrice
  }
}

