<template>
  <aside class="w-64 max-xl:w-full flex-shrink-0 max-xl:mb-4">
    <nav class="space-y-1 max-xl:flex max-xl:gap-2 max-xl:overflow-x-auto max-xl:pb-2">
      <NuxtLink
        v-for="item in items"
        :key="item.section"
        :to="item.to"
        class="block px-4 max-xl:px-3 py-3 max-xl:py-2 text-sm max-xl:text-xs font-medium rounded-lg transition-colors max-xl:flex-shrink-0 max-xl:whitespace-nowrap"
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

