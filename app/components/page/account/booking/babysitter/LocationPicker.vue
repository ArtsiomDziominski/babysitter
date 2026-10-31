<template>
  <div id="sitter-location" class="scroll-mt-24">
    <div class="flex items-center justify-between gap-3 mb-2 max-sm:flex-col max-sm:items-start">
      <label class="block text-sm font-medium text-default">
        {{ t('account.nannyForm.location.title') }}
      </label>
      <UButton
          color="neutral"
          variant="outline"
          size="xs"
          icon="i-lucide-locate-fixed"
          :loading="isLocating"
          @click="locateMe"
      >
        {{ t('account.nannyForm.location.myLocation') }}
      </UButton>
    </div>
    <div
        ref="mapEl"
        class="app-map h-72 max-sm:h-64 rounded-lg border border-default overflow-hidden"
    />
    <p class="mt-2 text-xs text-muted">
      {{ t('account.nannyForm.location.hint') }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type * as Leaflet from 'leaflet'
import type { BabysitterProfilePayload } from '~/composables/useBabysitter'
import { getCityCenter } from '~/const/cities'

const form = inject<Ref<BabysitterProfilePayload>>('babysitterForm')
if (!form) {
  throw new Error('babysitterForm is not provided')
}

const { t } = useI18n()
const toast = useToast()

// Радиус круга совпадает с точностью, с которой бэк хранит точку
const AREA_RADIUS_METERS = 400

const mapEl = ref<HTMLElement | null>(null)
const isLocating = ref(false)

let L: typeof Leaflet | null = null
let map: Leaflet.Map | null = null
let marker: Leaflet.Marker | null = null
let area: Leaflet.Circle | null = null

const currentPoint = (): [number, number] => {
  const { latitude, longitude } = form.value
  if (latitude != null && longitude != null) return [Number(latitude), Number(longitude)]
  return getCityCenter(form.value.city)
}

const setPoint = (point: [number, number], pan = false) => {
  form.value.latitude = point[0]
  form.value.longitude = point[1]
  if (pan) map?.setView(point, Math.max(map.getZoom(), 14))
}

// Маркер следует за формой: в том числе когда её сбросили или няня выбрала другой город
watch(() => [form.value.latitude, form.value.longitude, form.value.city] as const, (value, previous) => {
  const point = currentPoint()
  marker?.setLatLng(point)
  area?.setLatLng(point)
  if (value[2] !== previous[2]) map?.setView(point, 12)
})

const locateMe = () => {
  if (!navigator.geolocation) {
    toast.add({ title: t('account.nannyForm.location.geoError'), color: 'error' })
    return
  }
  isLocating.value = true
  navigator.geolocation.getCurrentPosition(
      (position) => {
        isLocating.value = false
        setPoint([position.coords.latitude, position.coords.longitude], true)
      },
      () => {
        isLocating.value = false
        toast.add({ title: t('account.nannyForm.location.geoError'), color: 'error' })
      },
      { enableHighAccuracy: false, timeout: 10000 },
  )
}

onMounted(async () => {
  L = await loadLeaflet()
  if (!mapEl.value) return

  const point = currentPoint()
  map = L.map(mapEl.value).setView(point, 13)
  addTileLayer(L, map)

  area = L.circle(point, {
    radius: AREA_RADIUS_METERS,
    className: 'app-map-area',
    fillOpacity: 0.15,
    weight: 2,
    interactive: false,
  }).addTo(map)

  marker = L.marker(point, {
    draggable: true,
    icon: L.divIcon({
      className: '',
      iconSize: undefined,
      html: '<div class="app-map-pin is-active">●</div>',
    }),
  }).addTo(map)

  marker.on('drag', () => area?.setLatLng(marker!.getLatLng()))
  marker.on('dragend', () => {
    const { lat, lng } = marker!.getLatLng()
    setPoint([lat, lng])
  })
  map.on('click', (event: Leaflet.LeafletMouseEvent) => {
    setPoint([event.latlng.lat, event.latlng.lng])
  })
})

onBeforeUnmount(() => {
  map?.remove()
  map = null
  marker = null
  area = null
})
</script>
