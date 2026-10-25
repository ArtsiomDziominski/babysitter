<template>
  <div class="flex items-center justify-between mb-6 max-xl:flex-col max-xl:items-stretch max-xl:gap-4">
    <div class="flex items-center gap-4 max-xl:flex-col max-xl:items-stretch max-xl:gap-2">
      <span class="text-sm text-muted">
        {{ $t('bookings.found') }}: <span class="font-semibold text-highlighted">{{ count }}</span>
      </span>
      <USelect
        :model-value="sortBy"
        :items="sortOptions"
        labelKey="label"
        valueKey="value"
        icon="i-lucide-arrow-up-down"
        variant="ghost"
        @update:model-value="$emit('update:sortBy', $event)"
      />
    </div>
    <div class="flex items-center gap-2 max-xl:hidden">
      <UTooltip :text="$t('bookings.view.tooltip.list')">
        <UButton
          icon="i-lucide-list"
          :variant="viewMode === SearchViewMode.LIST ? 'soft' : 'ghost'"
          :color="viewMode === SearchViewMode.LIST ? 'primary' : 'neutral'"
          @click="$emit('update:viewMode', SearchViewMode.LIST)"
        />
      </UTooltip>
      <UTooltip :text="$t('bookings.view.tooltip.card')">
        <UButton
          icon="i-lucide-layout-grid"
          :variant="viewMode === SearchViewMode.CARD ? 'soft' : 'ghost'"
          :color="viewMode === SearchViewMode.CARD ? 'primary' : 'neutral'"
          @click="$emit('update:viewMode', SearchViewMode.CARD)"
        />
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
