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
      <UTooltip :text="$t('bookings.view.tooltip.list')">
        <UButton
          :variant="viewMode === SearchViewMode.LIST ? 'solid' : 'outline'"
          :class="viewMode === SearchViewMode.LIST ? '' : 'cursor-pointer'"
          color="primary"
          size="sm"
          @click="$emit('update:viewMode', SearchViewMode.LIST)"
        >
          <Icon name="i-lucide-list" />
        </UButton>
      </UTooltip>
      <UTooltip :text="$t('bookings.view.tooltip.card')">
        <UButton
          :variant="viewMode === SearchViewMode.CARD ? 'solid' : 'outline'"
          :class="viewMode === SearchViewMode.CARD ? '' : 'cursor-pointer'"
          color="primary"
          size="sm"
          @click="$emit('update:viewMode', SearchViewMode.CARD)"
        >
          <Icon name="i-lucide-grid" />
        </UButton>
      </UTooltip>
      <!-- <UTooltip :text="$t('bookings.view.tooltip.map')">
        <UButton
          :variant="viewMode === SearchViewMode.MAP ? 'solid' : 'outline'"
          :class="viewMode === SearchViewMode.MAP ? '' : 'cursor-pointer'"
          color="primary"
          size="sm"
          @click="$emit('update:viewMode', SearchViewMode.MAP)"
        >
          <Icon name="i-lucide-map" />
        </UButton>
      </UTooltip> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { SearchViewMode, type SearchViewModeType } from '~/const/viewMode'

const { t } = useI18n()

defineProps<{
  count: number
  sortBy: string
  viewMode: SearchViewModeType
}>()

defineEmits<{
  'update:sortBy': [value: string]
  'update:viewMode': [value: SearchViewModeType]
}>()

const sortOptions = computed(() => {
  try {
    return [
      { label: t('bookings.sort.recommended'), value: 'recommended' },
      { label: t('bookings.sort.priceAsc'), value: 'price_asc' },
      { label: t('bookings.sort.priceDesc'), value: 'price_desc' },
      { label: t('bookings.sort.rating'), value: 'rating' },
      { label: t('bookings.sort.newest'), value: 'new' }
    ]
  } catch {
    return []
  }
})
</script>
