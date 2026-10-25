<template>
  <section class="pt-20 sm:pt-28">
    <UContainer>
      <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 class="font-display text-3xl font-semibold tracking-tight text-highlighted sm:text-4xl lg:text-5xl">
            {{ $t('home.blog.title') }}
          </h2>
          <p class="mt-3 text-lg text-muted">
            {{ $t('home.blog.subtitle') }}
          </p>
        </div>
        <UButton
          to="/blog"
          :label="$t('home.blog.cta')"
          trailing-icon="i-lucide-arrow-right"
          variant="link"
          size="lg"
          class="px-0 font-bold"
        />
      </div>

      <ul v-if="loading" class="divide-y divide-accented border-y border-accented">
        <li v-for="i in 3" :key="i" class="flex animate-pulse items-center gap-8 py-7">
          <div class="h-4 w-24 rounded bg-accented" />
          <div class="h-6 flex-1 rounded bg-accented" />
        </li>
      </ul>

      <ul v-else-if="articles.length > 0" class="divide-y divide-accented border-y border-accented">
        <li v-for="article in articles" :key="article.id">
          <NuxtLink
            :to="`/blog/${article.slug}`"
            class="group flex flex-wrap items-center gap-x-8 gap-y-2 py-6"
          >
            <span class="w-32 shrink-0 text-sm text-muted">
              {{ article.categories?.[0]?.name }}
            </span>
            <span class="min-w-0 flex-1 basis-80 text-xl font-bold text-highlighted transition-colors group-hover:text-primary sm:text-2xl">
              {{ article.title }}
            </span>
            <span class="flex items-center gap-2 text-sm text-muted">
              <span v-if="article.published">{{ formatDate(article.published) }}</span>
              <UIcon name="i-lucide-arrow-right" class="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </NuxtLink>
        </li>
      </ul>
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

