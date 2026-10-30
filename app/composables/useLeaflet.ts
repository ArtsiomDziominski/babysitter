import type * as Leaflet from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'

// Тайлы OpenStreetMap: бесплатно и без ключа, но с обязательной подписью.
// При большом трафике политика OSM просит перейти на коммерческого провайдера — достаточно поменять URL.
export const MAP_TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
export const MAP_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'

let leafletPromise: Promise<typeof Leaflet> | null = null

/** Leaflet работает только в браузере, поэтому грузится лениво (вместе с плагином кластеров). */
export const loadLeaflet = () => {
  if (!leafletPromise) {
    leafletPromise = (async () => {
      const L = (await import('leaflet')).default
      // Плагин кластеров расширяет глобальный L
      ;(window as any).L = L
      await import('leaflet.markercluster')
      return L
    })()
  }
  return leafletPromise
}

export const addTileLayer = (L: typeof Leaflet, map: Leaflet.Map) =>
  L.tileLayer(MAP_TILE_URL, { attribution: MAP_ATTRIBUTION, maxZoom: 18 }).addTo(map)
