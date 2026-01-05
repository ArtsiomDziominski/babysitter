<template>
  <div class="mt-12">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
      {{ $t('blog.relatedArticles.title') }}
    </h2>
    <div v-if="loading" class="flex flex-wrap gap-6">
      <div v-for="i in 3" :key="i" class="flex-1 min-w-[280px] bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden animate-pulse">
        <div class="h-48 bg-gray-200 dark:bg-gray-700"></div>
        <div class="p-4 space-y-3">
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        </div>
      </div>
    </div>
    <div v-else-if="articles.length > 0" class="flex flex-wrap gap-6">
      <NuxtLink
        v-for="article in articles"
        :key="article.id"
        :to="`/blog/${article.slug}`"
        class="flex-1 min-w-[280px]"
      >
        <BlogCard
          :post="article"
        />
      </NuxtLink>
    </div>
    <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
      {{ $t('blog.relatedArticles.notFound') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BlogPost } from '~/types/blog'

interface Props {
  excludeSlug?: string
  limit?: number
}

const props = withDefaults(defineProps<Props>(), {
  limit: 3
})

const articles = ref<BlogPost[]>([])
const loading = ref(false)
const articlesComposable = useArticles()

const loadRelatedArticles = async () => {
  loading.value = true
  try {
    const response = await articlesComposable.getArticles({
      limit: props.limit + 5,
      sort: 'published',
      order: 'desc'
    })
    
    const filtered = response.data.filter(article => article.slug !== props.excludeSlug)
    articles.value = filtered.slice(0, props.limit)
  } catch (error) {
    console.error('Ошибка загрузки связанных статей:', error)
    articles.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadRelatedArticles()
})
</script>

