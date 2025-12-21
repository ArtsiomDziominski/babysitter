<template>
  <div class="space-y-4">
    <div
      v-for="review in sitter.reviews || []"
      :key="review.id"
      class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8 hover:shadow-md transition-shadow"
    >
      <div class="flex items-start justify-between mb-4">
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <span class="text-primary-600 dark:text-primary-400 font-bold text-lg">
                {{ review.author.charAt(0).toUpperCase() }}
              </span>
            </div>
            <div>
              <div class="font-semibold text-gray-900 dark:text-white text-lg">
                {{ review.author }}
              </div>
              <div class="flex items-center gap-1 mt-1">
                <Icon
                  v-for="i in 5"
                  :key="i"
                  name="i-lucide-star"
                  :class="i <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'"
                  size="18"
                />
              </div>
            </div>
          </div>
        </div>
        <span class="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
          {{ formatDate(review.date) }}
        </span>
      </div>
      <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
        {{ review.text }}
      </p>
    </div>
    <div v-if="!sitter.reviews || sitter.reviews.length === 0" class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
      <Icon name="i-lucide-message-square" size="48" class="text-gray-400 mx-auto mb-4" />
      <p class="text-gray-500 dark:text-gray-400 text-lg">
        Пока нет отзывов
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Sitter } from '~/types/sitter'
import { useSitterUtils } from '~/composables/useSitterUtils'

defineProps<{
  sitter: Sitter
}>()

const { formatDate } = useSitterUtils()
</script>

