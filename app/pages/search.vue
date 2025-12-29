<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <SearchForm
            v-model="searchForm"
            @search="handleSearch"
        />

        <div class="flex">
          <SearchFilters v-model="filters"/>

          <div class="flex-1 p-6">
            <SearchToolbar
                :count="filteredSitters.length"
                v-model:sort-by="sortBy"
                :view-mode="viewMode"
                @update:view-mode="handleViewModeUpdate"
            />

            <div v-if="isLoading" class="flex justify-center items-center py-12">
              <div class="text-gray-500 dark:text-gray-400">{{ $t('bookings.loading') }}</div>
            </div>

            <template v-else>
              <div v-if="filteredSitters.length === 0" class="text-center py-12">
                <p class="text-gray-500 dark:text-gray-400">{{ $t('bookings.emptyShort') }}</p>
              </div>

              <SearchSitterList
                  v-else-if="viewMode === SearchViewMode.LIST"
                  :sitters="filteredSitters"
                  @book="handleBook"
              />

              <SearchSitterCard
                  v-else-if="viewMode === SearchViewMode.CARD"
                  :sitters="filteredSitters"
                  @book="handleBook"
              />

              <SearchSitterMap v-else/>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SearchFilters, SearchForm } from '~/types/sitter'
import type { BabysitterListItem, FetchBabysittersParams } from '~/composables/useBabysitter'
import { SearchViewMode, type SearchViewModeType } from '~/const/viewMode'
import { CITY_KEYS } from '~/const/cities'

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()
const siteConfig = useSiteConfig()

const currentUrl = `${siteConfig.url}${route.path}`

useSeoMeta({
  title: () => t('seo.search.title'),
  description: () => t('seo.search.description'),
  ogTitle: () => t('seo.search.title'),
  ogDescription: () => t('seo.search.description'),
  ogImage: `${siteConfig.url}${siteConfig.logo}`,
  ogUrl: currentUrl,
  ogType: 'website',
  ogLocale: locale.value,
  twitterCard: 'summary_large_image',
  twitterTitle: () => t('seo.search.title'),
  twitterDescription: () => t('seo.search.description'),
  twitterImage: `${siteConfig.url}${siteConfig.logo}`
})

useHead({
  link: [
    { rel: 'canonical', href: currentUrl }
  ]
})

const parseQueryParams = () => {
  const query = route.query

  return {
    searchForm: {
      address: (query.city as string) || (query.address as string) || '',
      date: (query.date as string) || '',
      timeStart: (query.startTime as string) || '',
      timeEnd: (query.endTime as string) || ''
    },
    filters: {
      onlyOnline: query.isOnline === 'true' || query.onlyOnline === 'true',
      priceMin: query.minRate ? Number(query.minRate) : undefined,
      priceMax: query.maxRate ? Number(query.maxRate) : undefined,
      minAge: query.minAge ? Number(query.minAge) : undefined,
      maxAge: query.maxAge ? Number(query.maxAge) : undefined,
      minRating: query.minRating ? Number(query.minRating) : undefined,
      maxRating: query.maxRating ? Number(query.maxRating) : undefined,
      childrenCount: query.childrenCount ? Number(query.childrenCount) : undefined,
      advantages: Array.isArray(query.advantage) ? query.advantage as string[] : (query.advantage ? [query.advantage as string] : [])
    },
    sortBy: (query.sort as string) || 'recommended'
  }
}

const initialParams = parseQueryParams()

const searchForm = ref<SearchForm>(initialParams.searchForm)

const filters = ref<SearchFilters>(initialParams.filters)

const sortBy = ref(initialParams.sortBy)

const skipNextWatch = ref(true)

const setInitialViewMode = () => {
  const saved = localStorage.getItem('searchViewMode')
  viewMode.value = (saved as SearchViewMode) || SearchViewMode.LIST
}

const viewMode = ref<SearchViewModeType>(SearchViewMode.LIST)

const handleViewModeUpdate = (newValue: SearchViewModeType) => {
  viewMode.value = newValue
  if (process.client) localStorage.setItem('searchViewMode', newValue)
}

const sitters = ref<BabysitterListItem[]>([])
const isLoading = ref(false)

const { fetchBabysitters } = useBabysitter()

const updateQueryParams = () => {
  const query: Record<string, string | string[]> = {}

  if (searchForm.value.address) {
    const cityKey = searchForm.value.address
    if (CITY_KEYS.includes(cityKey as any)) {
      query.city = cityKey
    } else {
      query.address = cityKey
    }
  }
  if (searchForm.value.date) query.date = searchForm.value.date
  if (searchForm.value.timeStart) query.startTime = searchForm.value.timeStart
  if (searchForm.value.timeEnd) query.endTime = searchForm.value.timeEnd

  if (filters.value.onlyOnline) query.isOnline = 'true'
  if (filters.value.priceMin !== undefined) query.minRate = filters.value.priceMin.toString()
  if (filters.value.priceMax !== undefined) query.maxRate = filters.value.priceMax.toString()
  if (filters.value.minAge !== undefined) query.minAge = filters.value.minAge.toString()
  if (filters.value.maxAge !== undefined) query.maxAge = filters.value.maxAge.toString()
  if (filters.value.minRating !== undefined) query.minRating = filters.value.minRating.toString()
  if (filters.value.maxRating !== undefined) query.maxRating = filters.value.maxRating.toString()
  if (filters.value.childrenCount !== undefined) query.childrenCount = filters.value.childrenCount.toString()
  if (filters.value.advantages && filters.value.advantages.length > 0) {
    query.advantage = filters.value.advantages
  }

  if (sortBy.value && sortBy.value !== 'recommended') {
    query.sort = sortBy.value
  }

  router.replace({ query })
}

const loadBabysitters = async () => {
  isLoading.value = true
  try {
    const params: FetchBabysittersParams = {
      sort: sortBy.value || 'recommended'
    }

    if (filters.value.priceMin) params.minRate = filters.value.priceMin
    if (filters.value.priceMax) params.maxRate = filters.value.priceMax
    if (filters.value.minAge) params.minAge = filters.value.minAge
    if (filters.value.maxAge) params.maxAge = filters.value.maxAge
    if (filters.value.minRating) params.minRating = filters.value.minRating
    if (filters.value.maxRating) params.maxRating = filters.value.maxRating
    if (searchForm.value.address) {
      const cityKey = searchForm.value.address
      if (CITY_KEYS.includes(cityKey as any)) {
        params.city = cityKey
      } else {
        params.search = searchForm.value.address
      }
    }
    if (searchForm.value.date) params.date = searchForm.value.date
    if (searchForm.value.timeStart) params.startTime = searchForm.value.timeStart
    if (searchForm.value.timeEnd) params.endTime = searchForm.value.timeEnd
    if (filters.value.onlyOnline) params.isOnline = true
    if (filters.value.advantages && filters.value.advantages.length > 0) {
      params.advantage = filters.value.advantages
    }

    const response = await fetchBabysitters(params)
    sitters.value = response.data?.data || []
  } catch (error) {
    console.error('Ошибка загрузки нянь:', error)
    sitters.value = []
  } finally {
    isLoading.value = false
  }
}

const filteredSitters = computed(() => {
  let result = [...sitters.value]

  if (filters.value.priceMin !== undefined) {
    result = result.filter(s => {
      const price = s.priceOneChild ? parseFloat(s.priceOneChild) : 0
      return price >= filters.value.priceMin!
    })
  }

  if (filters.value.priceMax !== undefined) {
    result = result.filter(s => {
      const price = s.priceOneChild ? parseFloat(s.priceOneChild) : 0
      return price <= filters.value.priceMax!
    })
  }

  return result
})

const isUpdatingFromQuery = ref(false)

const handleSearch = () => {
  updateQueryParams()
  loadBabysitters()
}

watch([sortBy, filters, searchForm], () => {
  if (isUpdatingFromQuery.value || skipNextWatch.value) return
  updateQueryParams()
  loadBabysitters()
}, { deep: true })

onMounted(() => {
  loadBabysitters()
  setInitialViewMode()
  nextTick(() => {
    skipNextWatch.value = false
  })
})

const handleBook = (sitterId: string | number) => {
  router.push(`/sitter/${ sitterId }`)
}
</script>
