<template>
  <div
    class="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow"
  >
    <div class="flex gap-6">
      <div class="flex-shrink-0">
        <UAvatar
          :src="sitter.avatar"
          :alt="sitter.name"
          size="xl"
          class="border-2 border-gray-200 dark:border-gray-700"
        />
        <div
          v-if="sitter.isNew"
          class="mt-2 text-xs text-center px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded"
        >
          {{ $t('bookings.sitter.new') }}
        </div>
      </div>

      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between mb-2">
          <div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ sitter.name }}
            </h3>
            <div class="flex items-center gap-2 mt-1">
              <div class="flex items-center">
                <Icon name="i-lucide-star" class="text-yellow-400" />
                <span class="ml-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ sitter.rating }}
                </span>
              </div>
              <span class="text-sm text-gray-500 dark:text-gray-400">
                {{ sitter.orders }} {{ $t('bookings.sitter.orders') }}
              </span>
              <span class="text-sm text-gray-500 dark:text-gray-400">
                {{ sitter.hours }} {{ $t('bookings.sitter.hours') }}
              </span>
            </div>
          </div>
          <div class="text-right">
            <div class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ sitter.price }} ₽
              <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
                {{ $t('bookings.sitter.perHour') }}
              </span>
            </div>
          </div>
        </div>

        <p class="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {{ sitter.description }}
        </p>

        <div class="flex flex-wrap gap-2 mb-4">
          <span
            v-for="tag in sitter.tags"
            :key="tag"
            class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
          >
            {{ tag }}
          </span>
        </div>

        <UButton
          color="primary"
          size="lg"
          block
          @click="$emit('book', sitter.id)"
        >
          {{ $t('bookings.sitter.book') }}
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Sitter } from '~/types/sitter'

defineProps<{
  sitter: Sitter
}>()

defineEmits<{
  book: [sitterId: string]
}>()
</script>
