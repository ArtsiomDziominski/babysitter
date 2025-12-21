<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
      Статистика
    </h3>
    <div class="grid grid-cols-2 gap-4">
      <div class="flex flex-col items-center text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <div class="p-2 bg-primary/10 rounded-lg mb-2">
          <Icon name="i-lucide-shopping-bag" size="20" class="text-primary-500" />
        </div>
        <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ sitter.orders }}</div>
        <div class="text-xs text-gray-600 dark:text-gray-400">Заказов</div>
      </div>

      <div class="flex flex-col items-center text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <div class="p-2 bg-primary/10 rounded-lg mb-2">
          <Icon name="i-lucide-clock" size="20" class="text-primary-500" />
        </div>
        <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ sitter.hours }}</div>
        <div class="text-xs text-gray-600 dark:text-gray-400">Часов</div>
      </div>

      <div v-if="sitter.returningClients" class="flex flex-col items-center text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <div class="p-2 bg-primary/10 rounded-lg mb-2">
          <Icon name="i-lucide-repeat" size="20" class="text-primary-500" />
        </div>
        <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ sitter.returningClients }}</div>
        <div class="text-xs text-gray-600 dark:text-gray-400">Вернулись</div>
      </div>

      <div v-if="sitter.responseTime" class="flex flex-col items-center text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <div class="p-2 bg-primary/10 rounded-lg mb-2">
          <Icon name="i-lucide-message-circle" size="20" class="text-primary-500" />
        </div>
        <div class="text-sm font-bold text-gray-900 dark:text-white">{{ sitter.responseTime }}</div>
        <div class="text-xs text-gray-600 dark:text-gray-400">Ответ</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Sitter } from '~/types/sitter'

defineProps<{
  sitter: Sitter
}>()
</script>

