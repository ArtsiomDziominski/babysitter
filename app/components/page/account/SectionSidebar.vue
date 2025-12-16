<template>
  <aside class="w-64 flex-shrink-0">
    <nav class="space-y-1">
      <NuxtLink
        v-for="item in items"
        :key="item.section"
        :to="item.to"
        class="block px-4 py-3 text-sm font-medium rounded-lg transition-colors"
        :class="activeSection === item.section
          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'"
      >
        {{ $t(item.label) }}
      </NuxtLink>
    </nav>
  </aside>
</template>

<script setup lang="ts">
interface MenuItem {
  to: string
  label: string
  section: string
}

interface Props {
  items: MenuItem[]
  activeSection: string
}

defineProps<Props>()
</script>

