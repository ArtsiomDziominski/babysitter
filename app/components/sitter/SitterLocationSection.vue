<template>
  <div v-if="hasLocation" class="bg-default rounded-xl border border-default p-6 md:p-8">
    <div class="flex items-center gap-3 mb-6">
      <div class="p-2 bg-primary/10 rounded-lg">
        <Icon name="i-lucide-map-pin" size="24" class="text-primary" />
      </div>
      <div>
        <h3 class="text-xl font-bold text-highlighted">
          {{ $t('bookings.sitter.location.title') }}
        </h3>
        <p v-if="sitter.city" class="text-sm text-muted">
          {{ $t(`cities.${ sitter.city }`) }}
        </p>
      </div>
    </div>
    <div ref="mapEl" class="app-map h-64 rounded-lg border border-default overflow-hidden" />
    <p class="mt-2 text-xs text-muted">
      {{ $t('bookings.sitter.location.note') }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type * as Leaflet from 'leaflet'
import type { Sitter } from '~/types/sitter'
import { isCityCenter } from '~/const/cities'

const props = defineProps<{
  sitter: Sitter
}>()

// Тот же радиус, что в анкете няни: точка хранится с точностью ~500 м
const AREA_RADIUS_METERS = 400

const mapEl = ref<HTMLElement | null>(null)
let map: Leaflet.Map | null = null

// Точка в центре города поставлена автоматически, а не няней: такой «район» ничего не говорит, не показываем
const hasLocation = computed(() => {
  const { latitude, longitude, city } = props.sitter
  return latitude != null && longitude != null && !isCityCenter(city, Number(latitude), Number(longitude))
})

onMounted(async () => {
  if (!hasLocation.value) return
  const L = await loadLeaflet()
  if (!mapEl.value) return

  const point: [number, number] = [Number(props.sitter.latitude), Number(props.sitter.longitude)]
  // Карта только для ориентира: колесо мыши не перехватываем, чтобы не мешать прокрутке страницы
  map = L.map(mapEl.value, { scrollWheelZoom: false }).setView(point, 14)
  addTileLayer(L, map)
  L.circle(point, {
    radius: AREA_RADIUS_METERS,
    className: 'app-map-area',
    fillOpacity: 0.2,
    weight: 2,
    interactive: false,
  }).addTo(map)
})

onBeforeUnmount(() => {
  map?.remove()
  map = null
})
</script>
