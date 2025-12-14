export const useSitterUtils = () => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatLastSeen = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) {
      return 'только что'
    }
    if (diffMins < 60) {
      const mins = diffMins % 60
      if (mins === 1) return '1 минуту назад'
      if (mins >= 2 && mins <= 4) return `${mins} минуты назад`
      return `${mins} минут назад`
    }
    if (diffHours < 24) {
      if (diffHours === 1) return '1 час назад'
      if (diffHours >= 2 && diffHours <= 4) return `${diffHours} часа назад`
      return `${diffHours} часов назад`
    }
    if (diffDays === 1) {
      return 'вчера'
    }
    if (diffDays < 7) {
      return `${diffDays} дней назад`
    }
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long'
    })
  }

  const getAgeText = (age: number) => {
    const lastDigit = age % 10
    const lastTwoDigits = age % 100
    
    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
      return 'лет'
    }
    if (lastDigit === 1) {
      return 'год'
    }
    if (lastDigit >= 2 && lastDigit <= 4) {
      return 'года'
    }
    return 'лет'
  }

  return {
    formatDate,
    formatLastSeen,
    getAgeText
  }
}
