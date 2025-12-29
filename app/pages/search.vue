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

const { t, locale } = useI18n()
const route = useRoute()
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

const searchForm = ref<SearchForm>({
  address: '',
  date: '',
  timeStart: '',
  timeEnd: ''
})

const filters = ref<SearchFilters>({
  onlyOnline: false,
  priceMin: undefined,
  priceMax: undefined,
  childrenCount: undefined,
  advantages: {
    kidsoutSchool: false,
    infants: false,
    specialNeeds: false,
    homework: false,
    french: false,
    music: false,
    active: false,
    english: false,
    driver: false,
    medical: false,
    firstAid: false
  }
})

const sortBy = ref('recommended')

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

const loadBabysitters = async () => {
  isLoading.value = true
  try {
    const params: FetchBabysittersParams = {
      sort: sortBy.value || 'recommended'
    }

    if (filters.value.priceMin) params.minRate = filters.value.priceMin
    if (filters.value.priceMax) params.maxRate = filters.value.priceMax
    if (searchForm.value.address) params.search = searchForm.value.address
    if (filters.value.onlyOnline) params.isOnline = true

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

  if (filters.value.advantages.infants) {
    result = result.filter(s => s.infantCare)
  }

  if (filters.value.advantages.specialNeeds) {
    result = result.filter(s => s.specialNeedsCare)
  }

  return result
})

const handleSearch = () => {
  loadBabysitters()
}

watch([sortBy, filters], () => {
  loadBabysitters()
}, { deep: true })

onMounted(() => {
  loadBabysitters()
  setInitialViewMode()
})

const router = useRouter()

const handleBook = (sitterId: string | number) => {
  router.push(`/sitter/${ sitterId }`)
}
</script>
