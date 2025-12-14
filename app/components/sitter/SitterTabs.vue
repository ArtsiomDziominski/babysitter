<template>
  <div class="border-b border-gray-200 dark:border-gray-700 mb-6">
    <div class="flex gap-6 overflow-x-auto">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="$emit('update:activeTab', tab.id)"
        class="px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors relative"
        :class="activeTab === tab.id
          ? 'text-primary-500'
          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'"
      >
        {{ tab.label }}
        <span
          v-if="activeTab === tab.id"
          class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"
        ></span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  activeTab: string
}>()

defineEmits<{
  'update:activeTab': [value: string]
}>()

const tabs = [
  { id: 'about', label: 'Обо мне' },
  { id: 'reviews', label: 'Отзывы' },
  { id: 'payment', label: 'Оплата' },
  { id: 'schedule', label: 'Расписание' },
  { id: 'conditions', label: 'Условия работы' },
  { id: 'safety', label: 'Безопасность' }
]
</script>
