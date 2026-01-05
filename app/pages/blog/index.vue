<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-4 sm:mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {{ $t('blog.title') }}
        </h1>
        <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          {{ $t('blog.subtitle') }}
        </p>
      </div>

      <div class="flex flex-col lg:flex-row gap-4 lg:gap-6">
        <div class="hidden lg:block lg:w-80 lg:flex-shrink-0">
          <BlogFilters
            v-model="filters"
            :tags="allTags"
            :categories="allCategories"
          />
        </div>

        <div class="flex-1 min-w-0">
          <div class="mb-4 sm:mb-6 flex flex-col sm:flex-row gap-3">
            <div class="flex-1">
              <UInput
                v-model="filters.searchQuery"
                :placeholder="$t('blog.searchPlaceholder')"
                icon="i-lucide-search"
                size="lg"
                @input="handleSearch"
              />
            </div>
            <UButton
              variant="outline"
              icon="i-lucide-filter"
              class="lg:hidden"
              @click="showFiltersModal = true"
            >
              {{ $t('blog.filters') }}
            </UButton>
          </div>

          <div v-if="selectedTags.length > 0 || filters.selectedCategory" class="mb-4 flex flex-wrap gap-2">
            <UBadge
              v-for="tag in selectedTags"
              :key="tag"
              color="primary"
              variant="subtle"
              size="lg"
              class="cursor-pointer"
              @click="removeTag(tag)"
            >
              {{ tag }}
              <Icon name="i-lucide-x" class="ml-1" size="14" />
            </UBadge>
            <UBadge
              v-if="filters.selectedCategory"
              color="primary"
              variant="subtle"
              size="lg"
              class="cursor-pointer"
              @click="filters.selectedCategory = null"
            >
              {{ filters.selectedCategory }}
              <Icon name="i-lucide-x" class="ml-1" size="14" />
            </UBadge>
            <UButton
              variant="ghost"
              size="sm"
              @click="clearFilters"
            >
              {{ $t('blog.clearAll') }}
            </UButton>
          </div>

          <div v-if="loading" class="text-center py-12">
            <p class="text-gray-500 dark:text-gray-400">{{ $t('blog.loading') }}</p>
          </div>

          <div v-else-if="posts.length > 0" class="space-y-4 sm:space-y-6">
            <BlogCard
              v-for="post in posts"
              :key="post.id"
              :post="post"
              @click="post.slug && navigateToPost(post.slug)"
            />
          </div>

          <div v-else class="text-center py-12">
            <p class="text-gray-500 dark:text-gray-400">
              {{ $t('blog.notFound') }}
            </p>
          </div>

          <div v-if="meta && meta.totalPages > 1" class="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-2">
            <UButton
              variant="outline"
              :disabled="currentPage === 1"
              icon="i-lucide-chevron-left"
              size="sm"
              class="w-full sm:w-auto"
              @click="goToPage(currentPage - 1)"
            >
              <span class="hidden sm:inline">{{ $t('blog.previous') }}</span>
            </UButton>
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-600 dark:text-gray-400">
                {{ $t('blog.pageInfo', { current: currentPage, total: meta.totalPages }) }}
              </span>
            </div>
            <UButton
              variant="outline"
              :disabled="currentPage === meta.totalPages"
              icon="i-lucide-chevron-right"
              icon-position="right"
              size="sm"
              class="w-full sm:w-auto"
              @click="goToPage(currentPage + 1)"
            >
              <span class="hidden sm:inline">{{ $t('blog.next') }}</span>
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <UModal v-model:open="showFiltersModal" :title="$t('blog.filters')" :ui="{ wrapper: 'items-end' }">
      <template #body>
        <div class="max-h-[70vh] overflow-y-auto">
          <BlogFilters
            v-model="filters"
            :tags="allTags"
            :categories="allCategories"
            hide-title
            class="!bg-transparent !shadow-none !p-0"
          />
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            color="neutral"
            variant="ghost"
            @click="showFiltersModal = false"
          >
            {{ $t('common.close') }}
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { BlogPost, BlogFilters } from '~/types/blog'
import { DEFAULT_BLOG_CATEGORIES, DEFAULT_BLOG_TAGS } from '~/const/blog'

const { t, locale } = useI18n()
const route = useRoute()
const siteConfig = useSiteConfig()
const articles = useArticles()

const currentUrl = `${siteConfig.url}${route.path}`

useSeoMeta({
  title: () => t('seo.blog.title'),
  description: () => t('seo.blog.description'),
  ogTitle: () => t('seo.blog.title'),
  ogDescription: () => t('seo.blog.description'),
  ogImage: `${siteConfig.url}${siteConfig.logo}`,
  ogUrl: currentUrl,
  ogType: 'website',
  ogLocale: locale.value,
  twitterCard: 'summary_large_image',
  twitterTitle: () => t('seo.blog.title'),
  twitterDescription: () => t('seo.blog.description'),
  twitterImage: `${siteConfig.url}${siteConfig.logo}`
})

useHead({
  link: [
    { rel: 'canonical', href: currentUrl }
  ]
})

const filters = ref<BlogFilters>({
  selectedTags: [],
  selectedCategory: null,
  searchQuery: ''
})

const showFiltersModal = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)

const allTags = ref<string[]>([...DEFAULT_BLOG_TAGS])
const allCategories = ref<string[]>([...DEFAULT_BLOG_CATEGORIES])

const selectedTags = computed(() => filters.value.selectedTags)

const loadTagsAndCategories = async () => {
  try {
    const response = await articles.getArticles({ page: 1, limit: 100 })
    
    const tagSet = new Set<string>()
    const categorySet = new Set<string>()

    response.data.forEach(post => {
      if (Array.isArray(post.tags)) {
        post.tags.forEach((tag: any) => {
          const tagName = typeof tag === 'string' ? tag : tag?.name
          if (tagName) tagSet.add(tagName)
        })
      }
      post.categories?.forEach((cat: any) => {
        if (cat?.name) categorySet.add(cat.name)
      })
    })

    const loadedTags = Array.from(tagSet).sort()
    const loadedCategories = Array.from(categorySet).sort()
    
    allTags.value = loadedTags.length > 0 ? loadedTags : [...DEFAULT_BLOG_TAGS]
    allCategories.value = loadedCategories.length > 0 ? loadedCategories : [...DEFAULT_BLOG_CATEGORIES]
  } catch (error) {
    console.error('Error loading tags and categories:', error)
  }
}

const loadArticlesData = async () => {
  try {
    if (process.server) {
      console.log('SSR: Loading articles')
    }
    
    const params: any = {
      page: currentPage.value,
      limit: pageSize.value
    }

    if (filters.value.searchQuery) {
      params.search = filters.value.searchQuery
    }

    if (filters.value.selectedCategory) {
      params.category = filters.value.selectedCategory
    }

    if (filters.value.selectedTags.length > 0) {
      params.tag = filters.value.selectedTags.join(',')
    }

    if (process.server) {
      console.log('SSR: Request params:', params)
    }

    const response = await articles.getArticles(params)
    
    if (process.server) {
      console.log('SSR: Articles loaded:', response?.data?.length || 0)
    }

    if (allTags.value.length === 0 && allCategories.value.length === 0) {
      await loadTagsAndCategories()
    }

    return response
  } catch (error) {
    console.error('Error loading articles:', error)
    return { data: [], meta: null }
  }
}

const { data: articlesData, pending: loading, refresh } = await useAsyncData(
  'blog-articles',
  loadArticlesData,
  {
    default: () => ({ data: [], meta: null })
  }
)

if (allTags.value.length === 0 && allCategories.value.length === 0) {
  await loadTagsAndCategories()
}

watch([currentPage, () => filters.value.searchQuery, () => filters.value.selectedCategory, () => filters.value.selectedTags], () => {
  refresh()
}, { deep: true })

const posts = computed(() => articlesData.value?.data || [])
const meta = computed(() => articlesData.value?.meta || null)

let searchTimeout: NodeJS.Timeout | null = null

const handleSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
  }, 500)
}

const removeTag = (tag: string) => {
  filters.value.selectedTags = filters.value.selectedTags.filter(t => t !== tag)
  currentPage.value = 1
}

const clearFilters = () => {
  filters.value.selectedTags = []
  filters.value.selectedCategory = null
  filters.value.searchQuery = ''
  currentPage.value = 1
}


const router = useRouter()

const goToPage = (page: number) => {
  currentPage.value = page
}

const navigateToPost = (slug: string) => {
  router.push(`/blog/${slug}`)
}

onUnmounted(() => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
})
</script>

