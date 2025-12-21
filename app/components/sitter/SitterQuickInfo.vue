<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
    <div class="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
      <div v-if="sitter.registeredAt" class="flex items-center gap-1.5">
        <Icon name="i-lucide-clock" size="16" />
        <span>На сайте с {{ formatDate(sitter.registeredAt) }}</span>
      </div>
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

