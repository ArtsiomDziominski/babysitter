<template>
  <div class="w-80 max-xl:!w-full border-r border-gray-200 dark:border-gray-700 max-xl:!border-r-0 p-6 max-xl:p-0 overflow-y-auto">
    <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 max-xl:hidden">
      {{ $t('bookings.filters.title') }}
    </h2>

    <div class="space-y-6">
      <div>
        <UCheckbox
          v-model="modelValue.onlyOnline"
          :label="$t('bookings.filters.onlyOnline')"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ $t('bookings.filters.priceRange') }}
        </label>
        <div class="flex gap-2">
          <UInput
            v-model.number="modelValue.priceMin"
            type="number"
            :placeholder="$t('bookings.filters.priceFrom')"
            size="sm"
          />
          <UInput
            v-model.number="modelValue.priceMax"
            type="number"
            :placeholder="$t('bookings.filters.priceTo')"
            size="sm"
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ $t('bookings.filters.ageRange') }}
        </label>
        <div class="flex gap-2">
          <UInput
            v-model.number="modelValue.minAge"
            type="number"
            :placeholder="$t('bookings.filters.ageFrom')"
            size="sm"
          />
          <UInput
            v-model.number="modelValue.maxAge"
            type="number"
            :placeholder="$t('bookings.filters.ageTo')"
            size="sm"
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ $t('bookings.filters.ratingRange') }}
        </label>
        <div class="flex gap-2">
          <UInput
            v-model.number="modelValue.minRating"
            type="number"
            min="0"
            max="5"
            step="0.1"
            :placeholder="$t('bookings.filters.ratingFrom')"
            size="sm"
          />
          <UInput
            v-model.number="modelValue.maxRating"
            type="number"
            min="0"
            max="5"
            step="0.1"
            :placeholder="$t('bookings.filters.ratingTo')"
            size="sm"
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ $t('bookings.filters.childrenCount') }}
        </label>
        <UInput
          v-model.number="modelValue.childrenCount"
          type="number"
          min="1"
          max="3"
          size="sm"
        />
      </div>

      <div>
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          {{ $t('bookings.filters.advantages.title') }}
        </h3>
        <div class="space-y-2 max-h-96 max-xl:max-h-none overflow-y-auto max-xl:overflow-visible">
          <label
            v-for="advantageKey in advantageKeys"
            :key="advantageKey"
            class="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 pl-2 rounded"
          >
            <UCheckbox
              :model-value="isAdvantageSelected(advantageKey)"
              @update:model-value="toggleAdvantage(advantageKey, !!$event)"
            />
            <span class="flex-1">{{ $t(`bookings.filters.advantages.additional.${advantageKey}`) }}</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SearchFilters } from '~/types/sitter'
import { ADVANTAGE_KEYS } from '~/const/advantages'

const props = defineProps<{
  modelValue: SearchFilters
}>()

const emit = defineEmits<{
  'update:modelValue': [value: SearchFilters]
}>()

const advantageKeys = ADVANTAGE_KEYS

const isAdvantageSelected = (key: string): boolean => {
  return (props.modelValue.advantages || []).includes(key)
}

const toggleAdvantage = (key: string, checked: boolean) => {
  const currentAdvantages = [...(props.modelValue.advantages || [])]
  
  if (checked) {
    if (!currentAdvantages.includes(key)) {
      currentAdvantages.push(key)
    }
  } else {
    const index = currentAdvantages.indexOf(key)
    if (index > -1) {
      currentAdvantages.splice(index, 1)
    }
  }
  
  emit('update:modelValue', {
    ...props.modelValue,
    advantages: currentAdvantages
  })
}
</script>
