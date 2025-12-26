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

export const CITY_KEYS = [City.TBILISI, City.BATUMI, City.KUTAISI, City.RUSTAVI, City.POTI];

export type CityType = City | string

