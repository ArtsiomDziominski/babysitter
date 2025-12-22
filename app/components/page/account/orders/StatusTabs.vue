<template>
  <div class="mb-6">
    <div class="flex gap-1 overflow-x-auto scrollbar-hide -mx-8 px-8">
      <button
        v-for="tab in tabs"
        :key="tab.value ?? 'all'"
        @click="$emit('update:selectedStatus', tab.value)"
        class="px-4 py-3 text-sm font-semibold whitespace-nowrap transition-all duration-200 relative group flex-shrink-0 cursor-pointer"
        :class="selectedStatus === tab.value
          ? 'text-primary-600 dark:text-primary-400'
          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'"
      >
        <span class="relative z-10">{{ tab.label }}</span>
        <span
          v-if="selectedStatus === tab.value"
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
const { t } = useI18n()

defineProps<{
  selectedStatus: string | null
}>()

defineEmits<{
  'update:selectedStatus': [value: string | null]
}>()

const tabs = computed(() => [
  { value: null, label: t('account.orders.tabs.all') },
  { value: 'pending', label: t('account.orders.status.pending') },
  { value: 'confirmed', label: t('account.orders.status.confirmed') },
  { value: 'in_progress', label: t('account.orders.status.in_progress') },
  { value: 'completed', label: t('account.orders.status.completed') },
  { value: 'cancelled', label: t('account.orders.status.cancelled') }
])
</script>

