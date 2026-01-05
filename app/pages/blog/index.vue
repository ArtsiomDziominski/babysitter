<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {{ $t('blog.title') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ $t('blog.subtitle') }}
        </p>
      </div>

      <div class="flex gap-6">
        <BlogFilters
          v-model="filters"
          :tags="allTags"
          :categories="allCategories"
          class="w-80 flex-shrink-0"
        />

        <div class="flex-1">
          <div class="mb-6">
            <UInput
              v-model="filters.searchQuery"
              :placeholder="$t('blog.searchPlaceholder')"
              icon="i-lucide-search"
              size="lg"
              @input="handleSearch"
            />
          </div>

          <div v-if="selectedTags.length > 0" class="mb-4 flex flex-wrap gap-2">
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

          <div v-else-if="posts.length > 0" class="space-y-6">
            <BlogCard
              v-for="post in posts"
              :key="post.id"
              :post="post"
              @click="navigateToPost(post.slug)"
            />
          </div>

          <div v-else class="text-center py-12">
            <p class="text-gray-500 dark:text-gray-400">
              {{ $t('blog.notFound') }}
            </p>
          </div>

          <div v-if="meta && meta.totalPages > 1" class="mt-8 flex justify-center gap-2">
            <UButton
              variant="outline"
              :disabled="currentPage === 1"
              icon="i-lucide-chevron-left"
              @click="goToPage(currentPage - 1)"
            >
              {{ $t('blog.previous') }}
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
              @click="goToPage(currentPage + 1)"
            >
              {{ $t('blog.next') }}
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BlogPost, BlogFilters } from '~/types/blog'

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

const posts = ref<BlogPost[]>([])
const meta = ref<{ page: number; limit: number; total: number; totalPages: number } | null>(null)
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)

const allTags = ref<string[]>([])
const allCategories = ref<string[]>([])

const selectedTags = computed(() => filters.value.selectedTags)

const loadArticles = async () => {
  loading.value = true
  try {
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

    const response = await articles.getArticles(params)
    posts.value = response.data
    meta.value = response.meta

    const tagSet = new Set<string>()
    const categorySet = new Set<string>()

    response.data.forEach(post => {
      post.tags?.forEach(tag => tagSet.add(tag.name))
      post.categories?.forEach(cat => categorySet.add(cat.name))
    })

    allTags.value = Array.from(tagSet).sort()
    allCategories.value = Array.from(categorySet).sort()
  } catch (error) {
    console.error('Ошибка загрузки статей:', error)
  } finally {
    loading.value = false
  }
}

let searchTimeout: NodeJS.Timeout | null = null

const handleSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    loadArticles()
  }, 500)
}

const removeTag = (tag: string) => {
  filters.value.selectedTags = filters.value.selectedTags.filter(t => t !== tag)
  currentPage.value = 1
  loadArticles()
}

const clearFilters = () => {
  filters.value.selectedTags = []
  filters.value.selectedCategory = null
  filters.value.searchQuery = ''
  currentPage.value = 1
  loadArticles()
}

watch(() => filters.value.selectedCategory, () => {
  currentPage.value = 1
  loadArticles()
})

const router = useRouter()

const goToPage = (page: number) => {
  currentPage.value = page
  loadArticles()
}

const navigateToPost = (slug: string) => {
  router.push(`/blog/${slug}`)
}

onMounted(() => {
  loadArticles()
})

onUnmounted(() => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
})
</script>
