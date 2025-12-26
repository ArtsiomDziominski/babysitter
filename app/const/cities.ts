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

export const CITY_KEYS = Object.values(City)

export type CityType = City | string

