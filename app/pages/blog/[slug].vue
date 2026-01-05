<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <BlogBreadcrumbs :article-title="article?.title" />

      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-500 dark:text-gray-400">{{ $t('blog.article.loading') }}</p>
      </div>

      <template v-else-if="article">
        <BlogArticleView
          :article="article"
          :cover-image="coverImage"
          @back="router.back()"
        />
        <BlogRelatedArticles :exclude-slug="article.slug" />
      </template>

      <div v-else class="text-center py-12">
        <p class="text-gray-500 dark:text-gray-400">{{ $t('blog.article.notFound') }}</p>
        <UButton
          variant="ghost"
          class="mt-4"
          @click="router.push('/blog')"
        >
          {{ $t('blog.article.returnToBlog') }}
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BlogPost } from '~/types/blog'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const articles = useArticles()
const siteConfig = useSiteConfig()

const article = ref<BlogPost | null>(null)
const loading = ref(false)

const slug = computed(() => route.params.slug as string)

const coverImage = computed(() => {
  if (!article.value?.coverImage) return null
  if (Array.isArray(article.value.coverImage)) {
    return article.value.coverImage[0]
  }
  return article.value.coverImage
})

const loadArticle = async () => {
  loading.value = true
  try {
    article.value = await articles.getArticle(slug.value)
  } catch (error) {
    console.error('Ошибка загрузки статьи:', error)
    article.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadArticle()
})

watch(() => route.params.slug, () => {
  loadArticle()
})

const currentUrl = computed(() => `${siteConfig.url}${route.path}`)

useSeoMeta({
  title: () => article.value?.seoTitle || article.value?.title || t('blog.article.defaultTitle'),
  description: () => article.value?.seoDescription || article.value?.excerpt || '',
  keywords: () => article.value?.seoKeywords || '',
  ogTitle: () => article.value?.seoTitle || article.value?.title || t('blog.article.defaultTitle'),
  ogDescription: () => article.value?.seoDescription || article.value?.excerpt || '',
  ogImage: () => coverImage.value || `${siteConfig.url}${siteConfig.logo}`,
  ogUrl: currentUrl,
  ogType: 'article',
  twitterCard: 'summary_large_image',
  twitterTitle: () => article.value?.seoTitle || article.value?.title || t('blog.article.defaultTitle'),
  twitterDescription: () => article.value?.seoDescription || article.value?.excerpt || '',
  twitterImage: () => coverImage.value || `${siteConfig.url}${siteConfig.logo}`
})

useHead({
  link: [
    { rel: 'canonical', href: currentUrl }
  ]
})
</script>

