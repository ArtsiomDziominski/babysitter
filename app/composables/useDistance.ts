/** Подпись расстояния до няни. Точка няни известна с точностью ~500 м, поэтому всё ближе километра — «меньше 1 км». */
export const useDistance = () => {
  const { t } = useI18n()

  const formatDistance = (km?: number | null) => {
    if (km == null) return ''
    if (km < 1) return t('bookings.distance.lessThanKm')
    const value = km < 10 ? Math.round(km * 10) / 10 : Math.round(km)
    return t('bookings.distance.km', { km: value })
  }

  return { formatDistance }
}
