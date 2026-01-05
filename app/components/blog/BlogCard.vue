<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
    @click="$emit('click')"
  >
    <div class="flex gap-6 p-6">
      <div v-if="coverImage" class="flex-shrink-0">
        <img
          :src="coverImage"
          :alt="post.title"
          class="w-48 h-32 object-cover rounded-lg"
        />
      </div>

      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between mb-2">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2 flex-wrap">
              <UBadge
                v-for="category in post.categories"
                :key="category.id"
                color="primary"
                variant="subtle"
                size="sm"
              >
                {{ category.name }}
              </UBadge>
              <span v-if="post.published" class="text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(post.published) }}
              </span>
            </div>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {{ post.title }}
            </h2>
            <p v-if="post.excerpt" class="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
              {{ post.excerpt }}
            </p>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div v-if="post.author" class="flex items-center gap-2">
              <img
                v-if="post.author.avatar"
                :src="post.author.avatar"
                :alt="authorName"
                class="w-6 h-6 rounded-full"
              />
              <span class="text-sm text-gray-600 dark:text-gray-400">
                {{ authorName }}
              </span>
            </div>
          </div>

          <div v-if="post.tags && post.tags.length > 0" class="flex flex-wrap gap-2">
            <UBadge
              v-for="tag in post.tags"
              :key="tag.id"
              variant="outline"
              size="sm"
            >
              {{ tag.name }}
            </UBadge>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BlogPost } from '~/types/blog'

const props = defineProps<{
  post: BlogPost
}>()

defineEmits<{
  click: []
}>()

const coverImage = computed(() => {
  if (!props.post.coverImage) return null
  if (Array.isArray(props.post.coverImage)) {
    return props.post.coverImage[0]
  }
  return props.post.coverImage
})

const authorName = computed(() => {
  if (!props.post.author) return ''
  return `${props.post.author.firstName} ${props.post.author.secondName}`.trim()
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>
