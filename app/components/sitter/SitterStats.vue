<template>
  <div class="space-y-4">
    <div
      v-for="stat in stats"
      :key="stat.label"
      class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4"
    >
      <div class="flex items-center gap-3 mb-2">
        <div class="p-2 bg-primary/10 rounded-lg">
          <Icon :name="stat.icon" size="24" class="text-primary-500" />
        </div>
        <div class="flex-1">
          <div class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ stat.value }}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            {{ stat.label }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Sitter } from '~/types/sitter'

const props = defineProps<{
  sitter: Sitter
}>()

const stats = computed(() => [
  {
    icon: 'i-lucide-shopping-bag',
    value: props.sitter.orders,
    label: 'Заказа выполнено'
  },
  {
    icon: 'i-lucide-clock',
    value: props.sitter.hours,
    label: 'Часов с детьми'
  },
  {
    icon: 'i-lucide-repeat',
    value: props.sitter.returningClients || 0,
    label: 'Родителей вернулись'
  },
  {
    icon: 'i-lucide-message-circle',
    value: props.sitter.responseTime || 'В течение дня',
    label: 'Скорость ответа'
  }
])
</script>
