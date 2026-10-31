<template>
  <div>
    <div class="xl:grid xl:grid-cols-[minmax(0,340px)_1fr] xl:gap-4">
      <!-- На десктопе список рядом с картой: наведение подсвечивает пин, клик по пину прокручивает к карточке -->
      <div
          ref="listEl"
          class="max-xl:hidden h-[calc(100vh-20rem)] min-h-[420px] overflow-y-auto space-y-2 pr-1"
      >
        <SearchMapListItem
            v-for="sitter in sitters"
            :key="sitter.id"
            :sitter="sitter"
            :active="sitter.id === selectedId || sitter.id === hoveredId"
            @mouseenter="hoveredId = sitter.id"
            @mouseleave="hoveredId = null"
            @book="$emit('book', $event)"
        />
        <p v-if="!sitters.length" class="py-12 text-center text-sm text-muted">
          {{ $t('bookings.emptyShort') }}
        </p>
      </div>

      <!-- Класс режима выбора точки вешаем на обёртку: на контейнер Leaflet добавляет свои классы, и Vue бы их стёр -->
      <div class="relative" :class="{ 'app-map-picking': pickMode }">
        <div
            ref="mapEl"
            class="app-map h-[calc(100vh-20rem)] min-h-[420px] max-xl:h-[65vh] max-xl:min-h-[360px] rounded-xl border border-default overflow-hidden"
        />

        <div class="absolute top-3 inset-x-14 z-[1000] flex justify-center pointer-events-none">
          <UButton
              v-if="showSearchArea"
              color="neutral"
              variant="outline"
              icon="i-lucide-search"
              class="pointer-events-auto bg-default shadow-md rounded-full"
              @click="searchArea"
          >
            {{ $t('bookings.map.searchArea') }}
          </UButton>
          <UButton
              v-else-if="boundsActive"
              color="primary"
              variant="solid"
              trailing-icon="i-lucide-x"
              class="pointer-events-auto shadow-md rounded-full"
              @click="$emit('reset-area')"
          >
            {{ $t('bookings.map.inArea') }}
          </UButton>
        </div>

        <UTooltip :text="$t('bookings.map.whereAmI')">
          <UButton
              color="neutral"
              variant="outline"
              icon="i-lucide-locate-fixed"
              class="absolute top-3 right-3 z-[1000] bg-default shadow-md"
              :loading="isLocating"
              :aria-label="$t('bookings.map.whereAmI')"
              @click="locateMe"
          />
        </UTooltip>

        <div
            v-if="pickMode"
            class="absolute bottom-8 inset-x-3 z-[1000] mx-auto max-w-sm rounded-xl border border-default bg-default px-4 py-3 text-sm text-center shadow-lg"
        >
          {{ $t('bookings.map.pickHint') }}
        </div>

        <div
            v-else-if="selectedSitter"
            class="xl:hidden absolute left-3 right-3 bottom-8 z-[1000] mx-auto max-w-md"
        >
          <SearchMapListItem
              :sitter="selectedSitter"
              class="shadow-lg pr-10"
              @book="$emit('book', $event)"
          />
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
import type { MapBounds } from '~/types/sitter'
import { getCityCenter } from '~/const/cities'

const props = defineProps<{
  sitters: BabysitterListItem[]
  city?: string
  // Поиск ограничен областью карты: не подгоняем карту под результаты, иначе она «уезжает» после каждого запроса
  boundsActive?: boolean
}>()

const emit = defineEmits<{
  book: [sitterId: string | number]
  'search-area': [bounds: MapBounds]
  'reset-area': []
}>()

// Режим «укажите, где вы»: включает родитель или поиск, когда геолокация недоступна
const pickMode = defineModel<boolean>('pickMode', { default: false })

const { t } = useI18n()
const toast = useToast()
const siteConfig = useSiteConfig()
const nearPoint = useNearPoint()

const mapEl = ref<HTMLElement | null>(null)
const listEl = ref<HTMLElement | null>(null)
const selectedId = ref<number | null>(null)
const hoveredId = ref<number | null>(null)
const showSearchArea = ref(false)
const isLocating = ref(false)

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
let meMarker: Leaflet.Marker | null = null
const markers = new Map<number, Leaflet.Marker>()

// Сдвиги карты из кода (подгонка под результаты) не должны предлагать «Искать в этой области»
let programmaticMove = false
const moveProgrammatically = (move: () => void) => {
  if (!map) return
  programmaticMove = true
  map.once('moveend', () => {
    programmaticMove = false
  })
  move()
  setTimeout(() => {
    programmaticMove = false
  }, 600)
}

const isHighlighted = (id: number) => id === selectedId.value || id === hoveredId.value

const pinIcon = (sitter: BabysitterListItem) => {
  const price = getPrice(sitter)
  const label = price != null ? `${ price } ${ siteConfig.currency }` : '•'
  return L!.divIcon({
    className: '',
    iconSize: undefined,
    html: `<div class="app-map-pin${ isHighlighted(sitter.id) ? ' is-active' : '' }">${ label }</div>`,
  })
}

const refreshPin = (id: number | null | undefined) => {
  if (id == null) return
  const sitter = sittersWithLocation.value.find(s => s.id === id)
  const marker = markers.get(id)
  if (!sitter || !marker) return
  marker.setIcon(pinIcon(sitter))
  marker.setZIndexOffset(isHighlighted(id) ? 1000 : 0)
  // Пин спрятан в кластере — подсвечиваем сам кластер
  const parent = cluster?.getVisibleParent(marker)
  if (parent && parent !== marker) {
    parent.getElement()?.querySelector('.app-map-cluster')?.classList.toggle('is-active', isHighlighted(id))
  }
}

const fitToResults = () => {
  if (!map || !cluster) return
  moveProgrammatically(() => {
    if (markers.size) {
      map!.fitBounds(cluster!.getBounds(), { padding: [48, 48], maxZoom: 14 })
    } else {
      map!.setView(nearPoint.point.value || getCityCenter(props.city), 12)
    }
  })
}

const renderMarkers = (fit: boolean) => {
  if (!L || !map || !cluster) return
  cluster.clearLayers()
  markers.clear()

  for (const sitter of sittersWithLocation.value) {
    const marker = L.marker([sitter.latitude!, sitter.longitude!], {
      icon: pinIcon(sitter),
      title: getName(sitter),
      riseOnHover: true,
    })
    marker.on('click', () => {
      selectedId.value = sitter.id
    })
    markers.set(sitter.id, marker)
    cluster.addLayer(marker)
  }

  if (fit) fitToResults()
}

const renderMe = () => {
  if (!L || !map) return
  const point = nearPoint.point.value
  if (!point) {
    meMarker?.remove()
    meMarker = null
    return
  }
  if (meMarker) {
    meMarker.setLatLng(point)
    return
  }
  meMarker = L.marker(point, {
    draggable: true,
    zIndexOffset: 2000,
    title: t('bookings.map.youAreHere'),
    icon: L.divIcon({ className: '', iconSize: L.point(20, 20), html: '<div class="app-map-me"></div>' }),
  }).addTo(map)
  meMarker.on('dragend', () => {
    const { lat, lng } = meMarker!.getLatLng()
    nearPoint.setPoint([lat, lng])
  })
}

const searchArea = () => {
  if (!map) return
  const bounds = map.getBounds()
  showSearchArea.value = false
  emit('search-area', {
    minLat: bounds.getSouth(),
    maxLat: bounds.getNorth(),
    minLng: bounds.getWest(),
    maxLng: bounds.getEast(),
  })
}

const locateMe = async () => {
  isLocating.value = true
  const located = await nearPoint.locate()
  isLocating.value = false
  if (located) {
    pickMode.value = false
    moveProgrammatically(() => map?.setView(nearPoint.point.value!, 13))
    return
  }
  // Геолокация запрещена или недоступна — предлагаем отметить точку вручную
  pickMode.value = true
  toast.add({ title: t('bookings.map.geoError'), description: t('bookings.map.pickHint'), color: 'warning' })
}

watch([selectedId, hoveredId], ([id, hovered], [previousId, previousHovered]) => {
  for (const sitterId of new Set([previousId, previousHovered, id, hovered])) refreshPin(sitterId)
})

// Клик по пину на десктопе прокручивает список к карточке няни
watch(selectedId, (id) => {
  if (id == null || !listEl.value) return
  listEl.value.querySelector(`[data-sitter-id="${ id }"]`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
})

watch(() => props.sitters, () => {
  if (selectedId.value != null && !selectedSitter.value) selectedId.value = null
  renderMarkers(!props.boundsActive)
})

watch(() => nearPoint.point.value, renderMe)

onMounted(async () => {
  L = await loadLeaflet()
  if (!mapEl.value) return

  map = L.map(mapEl.value, { scrollWheelZoom: true }).setView(nearPoint.point.value || getCityCenter(props.city), 12)
  addTileLayer(L, map)
  map.on('moveend', () => {
    if (!programmaticMove) showSearchArea.value = true
  })
  map.on('click', (event: Leaflet.LeafletMouseEvent) => {
    if (pickMode.value) {
      nearPoint.setPoint([event.latlng.lat, event.latlng.lng])
      pickMode.value = false
      return
    }
    closeCard()
  })

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
  renderMarkers(!props.boundsActive)
  renderMe()
})

onBeforeUnmount(() => {
  map?.remove()
  map = null
  cluster = null
  meMarker = null
  markers.clear()
})
</script>
