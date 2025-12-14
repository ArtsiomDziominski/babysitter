<template>
  <div class="flex items-center justify-between mb-6">
    <div class="flex items-center gap-4">
      <span class="text-sm text-gray-600 dark:text-gray-400">
        {{ $t('bookings.found') }}: {{ count }}
      </span>
      <USelect
        :model-value="sortBy"
        :items="sortOptions"
        labelKey="label"
        valueKey="value"
        size="sm"
        @update:model-value="$emit('update:sortBy', $event)"
      />
    </div>
    <div class="flex items-center gap-2">
      <UButton
        :variant="viewMode === 'list' ? 'solid' : 'outline'"
        color="primary"
        size="sm"
        @click="$emit('update:viewMode', 'list')"
      >
        <Icon name="i-lucide-list" />
      </UButton>
      <UButton
        :variant="viewMode === 'card' ? 'solid' : 'outline'"
        color="primary"
        size="sm"
        @click="$emit('update:viewMode', 'card')"
      >
        <Icon name="i-lucide-grid" />
      </UButton>
      <UButton
        :variant="viewMode === 'map' ? 'solid' : 'outline'"
        color="primary"
        size="sm"
        @click="$emit('update:viewMode', 'map')"
      >
        <Icon name="i-lucide-map" />
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

defineProps<{
  count: number
  sortBy: string
  viewMode: 'list' | 'card' | 'map'
}>()

defineEmits<{
  'update:sortBy': [value: string]
  'update:viewMode': [value: 'list' | 'card' | 'map']
}>()

const sortOptions = computed(() => {
  try {
    return [
      { label: t('bookings.sort.recommended'), value: 'recommended' },
      { label: t('bookings.sort.priceAsc'), value: 'priceAsc' },
      { label: t('bookings.sort.priceDesc'), value: 'priceDesc' },
      { label: t('bookings.sort.rating'), value: 'rating' },
      { label: t('bookings.sort.newest'), value: 'newest' }
    ]
  } catch {
    return []
  }
})
</script>
