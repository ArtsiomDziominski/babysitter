export enum City {
  TBILISI = 'tbilisi',
  BATUMI = 'batumi',
  KUTAISI = 'kutaisi',
  RUSTAVI = 'rustavi',
  GORI = 'gori',
  POTI = 'poti',
  MINSK = 'minsk',
  GOMEL = 'gomel',
  VITEBSK = 'vitebsk',
  GRODNO = 'grodno',
  BREST = 'brest',
  MOGILEV = 'mogilev',
}

export const CITY_KEYS = [City.TBILISI, City.BATUMI, City.KUTAISI, City.RUSTAVI, City.GORI, City.POTI];

export type CityType = City | string


// Центры городов для карты: сюда ставится точка няни, пока она не отметила свой район
export const CITY_CENTERS: Record<string, [number, number]> = {
  [City.TBILISI]: [41.7151, 44.8271],
  [City.BATUMI]: [41.6168, 41.6367],
  [City.KUTAISI]: [42.2679, 42.6946],
  [City.RUSTAVI]: [41.5495, 44.9932],
  [City.GORI]: [41.9847, 44.1083],
  [City.POTI]: [42.1462, 41.6719],
  [City.MINSK]: [53.9006, 27.559],
  [City.GOMEL]: [52.4345, 30.9754],
  [City.VITEBSK]: [55.1904, 30.2049],
  [City.GRODNO]: [53.6694, 23.8131],
  [City.BREST]: [52.0976, 23.7341],
  [City.MOGILEV]: [53.9168, 30.3449],
}

export const getCityCenter = (city?: string | null): [number, number] =>
  (city && CITY_CENTERS[city]) || CITY_CENTERS[City.TBILISI]!

/** Точка стоит ровно в центре города — значит, няня ещё не отмечала свой район (центр ставит бэк). */
export const isCityCenter = (city: string | null | undefined, latitude: number, longitude: number) => {
  const center = city ? CITY_CENTERS[city] : undefined
  return !!center && Math.abs(center[0] - latitude) < 1e-6 && Math.abs(center[1] - longitude) < 1e-6
}
