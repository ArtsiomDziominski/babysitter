<template>
  <div class="sticky top-0 z-20 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 mb-6 md:mb-8 shadow-sm -mx-6 md:-mx-8 px-6 md:px-8">
    <div class="flex gap-1 overflow-x-auto scrollbar-hide -mx-6 md:-mx-8 px-6 md:px-8">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="$emit('update:activeTab', tab.id)"
        class="px-4 md:px-5 py-3 md:py-4 text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 relative group flex-shrink-0"
        :class="activeTab === tab.id
          ? 'text-primary-600 dark:text-primary-400'
          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'"
      >
        <span class="relative z-10">{{ tab.label }}</span>
        <span
          v-if="activeTab === tab.id"
          class="absolute bottom-0 left-0 right-0 h-1 bg-primary-500 rounded-t-full transition-all duration-200"
        ></span>
        <span
          v-else
          class="absolute bottom-0 left-0 right-0 h-0.5 bg-transparent group-hover:bg-gray-300 dark:group-hover:bg-gray-600 transition-all duration-200"
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
