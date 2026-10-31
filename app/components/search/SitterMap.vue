<template>
  <div>
    <div class="relative">
      <div
          ref="mapEl"
          class="app-map h-[calc(100vh-20rem)] min-h-[420px] max-xl:h-[65vh] max-xl:min-h-[360px] rounded-xl border border-default overflow-hidden"
      />

      <div
          v-if="selectedSitter"
          class="absolute left-3 right-3 bottom-8 z-[1000] mx-auto max-w-md flex gap-3 items-center rounded-xl border border-default bg-default p-3 shadow-lg"
      >
        <div
            class="relative size-16 shrink-0 rounded-lg overflow-hidden bg-elevated cursor-pointer"
            @click="$emit('book', selectedSitter.id)"
        >
          <img
              v-if="selectedSitter.avatarUrl"
              :src="selectedSitter.avatarUrl"
              :alt="getName(selectedSitter)"
              class="w-full h-full object-cover"
          />
          <Icon v-else name="i-lucide-user" size="28" class="text-dimmed absolute inset-0 m-auto"/>
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-semibold text-highlighted truncate cursor-pointer" @click="$emit('book', selectedSitter.id)">
            {{ getName(selectedSitter) }}
          </p>
          <div class="flex items-center gap-2 text-sm text-muted">
            <span class="flex items-center">
              <UIcon name="i-mdi-star" class="size-4 text-amber-400"/>
              <span class="ml-1 text-default">{{ selectedSitter.rating ? parseFloat(selectedSitter.rating) : 0 }}</span>
            </span>
            <span v-if="getPrice(selectedSitter)">
              {{ getPrice(selectedSitter) }} {{ siteConfig.currency }}
            </span>
          </div>
        </div>
        <UButton
            color="primary"
            size="sm"
            trailing-icon="i-lucide-arrow-right"
            @click="$emit('book', selectedSitter.id)"
        >
          {{ $t('bookings.sitter.details') }}
        </UButton>
        <UButton
            color="neutral"
            variant="ghost"
            size="xs"
            icon="i-lucide-x"
            class="absolute -top-2 -right-2 rounded-full bg-default border border-default"
            :aria-label="$t('bookings.map.close')"
            @click="closeCard"
        />
      </div>
    </div>

    <p class="mt-2 flex items-center gap-1.5 text-xs text-muted">
      <Icon name="i-lucide-shield-check" size="14"/>
      {{ $t('bookings.map.approxNote') }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type * as Leaflet from 'leaflet'
import type { BabysitterListItem } from '~/composables/useBabysitter'
import { getCityCenter } from '~/const/cities'

const props = defineProps<{
  sitters: BabysitterListItem[]
  city?: string
}>()

defineEmits<{
  book: [sitterId: string | number]
}>()

const { t } = useI18n()
const siteConfig = useSiteConfig()

const mapEl = ref<HTMLElement | null>(null)
const selectedId = ref<number | null>(null)

const sittersWithLocation = computed(() =>
    props.sitters.filter(s => s.latitude != null && s.longitude != null)
)

const selectedSitter = computed(() =>
    sittersWithLocation.value.find(s => s.id === selectedId.value) || null
)

const getName = (sitter: BabysitterListItem) => {
  const lastInitial = sitter.lastName ? `${ sitter.lastName[0] }.` : ''
  return `${ sitter.firstName || '' } ${ lastInitial }`.trim() || t('bookings.sitter.noName')
}

const closeCard = () => {
  selectedId.value = null
}

const getPrice = (sitter: BabysitterListItem) =>
    sitter.priceOneChild ? parseFloat(sitter.priceOneChild) : null

let L: typeof Leaflet | null = null
let map: Leaflet.Map | null = null
let cluster: Leaflet.MarkerClusterGroup | null = null
const markers = new Map<number, Leaflet.Marker>()

const pinIcon = (sitter: BabysitterListItem, active: boolean) => {
  const price = getPrice(sitter)
  const label = price != null ? `${ price } ${ siteConfig.currency }` : '•'
  return L!.divIcon({
    className: '',
    iconSize: undefined,
    html: `<div class="app-map-pin${ active ? ' is-active' : '' }">${ label }</div>`,
  })
}

const renderMarkers = (fit: boolean) => {
  if (!L || !map || !cluster) return
  cluster.clearLayers()
  markers.clear()

  for (const sitter of sittersWithLocation.value) {
    const marker = L.marker([sitter.latitude!, sitter.longitude!], {
      icon: pinIcon(sitter, sitter.id === selectedId.value),
      title: getName(sitter),
      riseOnHover: true,
    })
    marker.on('click', () => {
      selectedId.value = sitter.id
    })
    markers.set(sitter.id, marker)
    cluster.addLayer(marker)
  }

  if (!fit) return
  if (markers.size) {
    map.fitBounds(cluster.getBounds(), { padding: [48, 48], maxZoom: 14 })
  } else {
    map.setView(getCityCenter(props.city), 12)
  }
}

watch(selectedId, (id, previousId) => {
  for (const sitterId of [previousId, id]) {
    if (sitterId == null) continue
    const sitter = sittersWithLocation.value.find(s => s.id === sitterId)
    const marker = markers.get(sitterId)
    if (sitter && marker) marker.setIcon(pinIcon(sitter, sitterId === id))
  }
})

watch(() => props.sitters, () => {
  if (selectedId.value != null && !selectedSitter.value) selectedId.value = null
  renderMarkers(true)
})

onMounted(async () => {
  L = await loadLeaflet()
  if (!mapEl.value) return

  map = L.map(mapEl.value, { scrollWheelZoom: true }).setView(getCityCenter(props.city), 12)
  addTileLayer(L, map)
  map.on('click', closeCard)

  cluster = L.markerClusterGroup({
    showCoverageOnHover: false,
    // Точки округлены до ~500 м, поэтому у нескольких нянь они совпадают: на максимальном зуме раскрываем «паучком»
    spiderfyOnMaxZoom: true,
    maxClusterRadius: 50,
    iconCreateFunction: (group) => L!.divIcon({
      className: '',
      iconSize: L!.point(40, 40),
      html: `<div class="app-map-cluster">${ group.getChildCount() }</div>`,
    }),
  })
  map.addLayer(cluster)
  renderMarkers(true)
})

onBeforeUnmount(() => {
  map?.remove()
  map = null
  cluster = null
  markers.clear()
})
</script>
