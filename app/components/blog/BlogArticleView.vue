<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
    <div v-if="coverImage" class="w-full h-64 md:h-96">
      <img
        :src="coverImage"
        :alt="article.title"
        class="w-full h-full object-cover"
      />
    </div>

    <div class="p-6 md:p-8">
      <div class="flex items-center gap-3 mb-4 flex-wrap">
        <UBadge
          v-for="category in article.categories"
          :key="category.id"
          color="primary"
          variant="subtle"
          size="sm"
        >
          {{ category.name }}
        </UBadge>
      </div>

      <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
        {{ article.title }}
      </h1>

      <div v-if="article.excerpt" class="text-lg text-gray-600 dark:text-gray-400 mb-6">
        {{ article.excerpt }}
      </div>

      <div class="prose prose-lg dark:prose-invert max-w-none">
        <BlogContent v-if="article.content" :content="article.content" />
        <div v-else class="text-gray-500 dark:text-gray-400">{{ $t('blog.article.noContent') }}</div>
      </div>

      <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div v-if="article.tags && article.tags.length > 0" class="mb-4">
          <div class="flex flex-wrap gap-2">
            <UBadge
              v-for="tag in article.tags"
              :key="tag.id"
              variant="outline"
              size="sm"
            >
              {{ tag.name }}
            </UBadge>
          </div>
        </div>
        
        <div v-if="article.author || article.published" class="flex items-center gap-4 flex-wrap text-sm text-gray-600 dark:text-gray-400">
          <div v-if="article.author" class="flex items-center gap-3">
            <img
              v-if="article.author.avatar"
              :src="article.author.avatar"
              :alt="authorName"
              class="w-10 h-10 rounded-full"
            />
            <span class="font-semibold text-gray-900 dark:text-white">
              {{ authorName }}
            </span>
          </div>
          <span v-if="article.published" class="flex items-center gap-2">
            <Icon name="i-lucide-calendar" size="16" />
            {{ formatDate(article.published) }}
          </span>
        </div>
      </div>

      <div class="mt-8">
        <UButton
          variant="ghost"
          icon="i-lucide-arrow-left"
          @click="handleBack"
        >
          {{ $t('blog.article.backToBlog') }}
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BlogPost } from '~/types/blog'

interface Props {
  article: BlogPost
  coverImage?: string | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  back: []
}>()

const { locale } = useI18n()

const authorName = computed(() => {
  if (!props.article.author) return ''
  return `${props.article.author.firstName} ${props.article.author.secondName}`.trim()
})

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

const handleBack = () => {
  emit('back')
}
</script>

