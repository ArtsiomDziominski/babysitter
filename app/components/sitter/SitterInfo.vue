<template>
  <div class="px-6 pb-6">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-1">
      {{ sitter.name }}
    </h1>
    <div class="flex items-center gap-4 text-gray-600 dark:text-gray-400 mb-4">
      <span v-if="sitter.age">{{ sitter.age }} {{ getAgeText(sitter.age) }}</span>
      <span v-if="sitter.registeredAt">
        На сайте с {{ formatDate(sitter.registeredAt) }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Sitter } from '~/types/sitter'
import { useSitterUtils } from '~/composables/useSitterUtils'

defineProps<{
  sitter: Sitter
}>()

const { formatDate, getAgeText } = useSitterUtils()
</script>
