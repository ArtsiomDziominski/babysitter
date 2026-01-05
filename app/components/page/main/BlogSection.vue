<template>
  <section class="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
    <UContainer>
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {{ $t('home.blog.title') }}
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {{ $t('home.blog.subtitle') }}
        </p>
      </div>

      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="i in 3" :key="i" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden animate-pulse">
          <div class="h-48 bg-gray-200 dark:bg-gray-700"></div>
          <div class="p-6 space-y-3">
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          </div>
        </div>
      </div>

      <div v-else-if="articles.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <NuxtLink
          v-for="article in articles"
          :key="article.id"
          :to="`/blog/${article.slug}`"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
        >
          <div v-if="getCoverImage(article)" class="w-full h-48 overflow-hidden">
            <img
              :src="getCoverImage(article)"
              :alt="article.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div class="p-6">
            <div class="flex items-center gap-2 mb-3 flex-wrap">
              <UBadge
                v-for="category in article.categories?.slice(0, 1)"
                :key="category.id"
                color="primary"
                variant="subtle"
                size="sm"
              >
                {{ category.name }}
              </UBadge>
              <span v-if="article.published" class="text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(article.published) }}
              </span>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-500 transition-colors">
              {{ article.title }}
            </h3>
            <p v-if="article.excerpt" class="text-gray-600 dark:text-gray-400 line-clamp-2">
              {{ article.excerpt }}
            </p>
          </div>
        </NuxtLink>
      </div>

      <div class="text-center">
        <UButton
          to="/blog"
          color="primary"
          size="lg"
          variant="solid"
        >
          {{ $t('home.blog.cta') }}
        </UButton>
      </div>
    </UContainer>
  </section>
</template>

<script setup lang="ts">
import type { BlogPost } from '~/types/blog'

const articles = ref<BlogPost[]>([])
const loading = ref(false)
const articlesComposable = useArticles()
const { locale } = useI18n()

const loadArticles = async () => {
  loading.value = true
  try {
    const response = await articlesComposable.getArticles({
      limit: 3,
      sort: 'published',
      order: 'desc'
    })
    articles.value = response.data
  } catch (error) {
    console.error('Ошибка загрузки статей:', error)
    articles.value = []
  } finally {
    loading.value = false
  }
}

const getCoverImage = (article: BlogPost) => {
  if (!article.coverImage) return null
  if (Array.isArray(article.coverImage)) {
    return article.coverImage[0]
  }
  return article.coverImage
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const localeMap: Record<string, string> = {
    ru: 'ru-RU',
    en: 'en-US',
    uk: 'uk-UA',
    be: 'be-BY',
    ka: 'ka-GE'
  }
  return date.toLocaleDateString(localeMap[locale.value] || 'ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(() => {
  loadArticles()
})
</script>

