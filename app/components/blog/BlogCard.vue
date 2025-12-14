<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
    @click="$emit('click')"
  >
    <div class="flex gap-6 p-6">
      <div v-if="post.image" class="flex-shrink-0">
        <img
          :src="post.image"
          :alt="post.title"
          class="w-48 h-32 object-cover rounded-lg"
        />
      </div>

      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between mb-2">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <UBadge
                :color="post.category === 'Для родителей' ? 'blue' : 'green'"
                variant="subtle"
                size="sm"
              >
                {{ post.category }}
              </UBadge>
              <span class="text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(post.publishedAt) }}
              </span>
            </div>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {{ post.title }}
            </h2>
            <p class="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
              {{ post.excerpt }}
            </p>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
              <img
                v-if="post.author.avatar"
                :src="post.author.avatar"
                :alt="post.author.name"
                class="w-6 h-6 rounded-full"
              />
              <span class="text-sm text-gray-600 dark:text-gray-400">
                {{ post.author.name }}
              </span>
            </div>
            <div class="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div class="flex items-center gap-1">
                <Icon name="i-lucide-clock" size="16" />
                <span>{{ post.readTime }} мин</span>
              </div>
              <div class="flex items-center gap-1">
                <Icon name="i-lucide-eye" size="16" />
                <span>{{ post.views }}</span>
              </div>
            </div>
          </div>

          <div class="flex flex-wrap gap-2">
            <UBadge
              v-for="tag in post.tags"
              :key="tag"
              variant="outline"
              size="sm"
            >
              {{ tag }}
            </UBadge>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BlogPost } from '~/types/blog'

defineProps<{
  post: BlogPost
}>()

defineEmits<{
  click: []
}>()

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>
