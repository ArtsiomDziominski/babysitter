<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-6">
        <UBreadcrumb :items="breadcrumbItems" />
      </div>

      <div v-if="sitter" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <SitterHeader
          :sitter="sitter"
          :is-favorite="isFavorite"
          @toggle-favorite="toggleFavorite"
        />

        <SitterInfo :sitter="sitter" />

        <div class="px-6 pb-6">
          <SitterActions />

          <SitterTabs
            :active-tab="activeTab"
            @update:active-tab="activeTab = $event"
          />

          <SitterTabContent
            :sitter="sitter"
            :active-tab="activeTab"
          />
        </div>
      </div>

      <div v-else class="text-center py-12">
        <p class="text-gray-500 dark:text-gray-400">
          Ситтер не найден
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Sitter } from '~/types/sitter'

const route = useRoute()
const sitterId = route.params.id as string

const activeTab = ref('about')
const isFavorite = ref(false)
const sitter = ref<Sitter | null>(null)

const breadcrumbItems = computed(() => [
  {
    label: 'Главная',
    icon: 'i-lucide-home',
    to: '/'
  },
  {
    label: 'Поиск',
    icon: 'i-lucide-search',
    to: '/search'
  },
  {
    label: sitter.value?.name || 'Ситтер',
    icon: 'i-lucide-user'
  }
])

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
}

</script>
