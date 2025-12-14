<template>
  <div class="w-80 border-r border-gray-200 dark:border-gray-700 p-6 overflow-y-auto max-h-[calc(100vh-20rem)]">
    <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
      {{ $t('bookings.filters.title') }}
    </h2>

    <div class="space-y-6">
      <div>
        <UCheckbox
          v-model="modelValue.onlyAvailable"
          :label="$t('bookings.filters.onlyAvailable')"
        />
      </div>

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
          {{ $t('bookings.filters.childrenCount') }}
        </label>
        <UInput
          v-model.number="modelValue.childrenCount"
          type="number"
          min="1"
          size="sm"
        />
      </div>

      <div>
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          {{ $t('bookings.filters.advantages.main.title') }}
        </h3>
        <div class="space-y-2">
          <UCheckbox
            v-model="modelValue.advantages.kidsoutSchool"
            :label="$t('bookings.filters.advantages.main.kidsoutSchool')"
          />
          <UCheckbox
            v-model="modelValue.advantages.infants"
            :label="$t('bookings.filters.advantages.main.infants')"
          />
          <UCheckbox
            v-model="modelValue.advantages.specialNeeds"
            :label="$t('bookings.filters.advantages.main.specialNeeds')"
          />
        </div>
      </div>

      <div>
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          {{ $t('bookings.filters.advantages.additional.title') }}
        </h3>
        <div class="space-y-2 max-h-64 overflow-y-auto">
          <UCheckbox
            v-model="modelValue.advantages.homework"
            :label="$t('bookings.filters.advantages.additional.homework')"
          />
          <UCheckbox
            v-model="modelValue.advantages.french"
            :label="$t('bookings.filters.advantages.additional.french')"
          />
          <UCheckbox
            v-model="modelValue.advantages.music"
            :label="$t('bookings.filters.advantages.additional.music')"
          />
          <UCheckbox
            v-model="modelValue.advantages.active"
            :label="$t('bookings.filters.advantages.additional.active')"
          />
          <UCheckbox
            v-model="modelValue.advantages.english"
            :label="$t('bookings.filters.advantages.additional.english')"
          />
          <UCheckbox
            v-model="modelValue.advantages.driver"
            :label="$t('bookings.filters.advantages.additional.driver')"
          />
          <UCheckbox
            v-model="modelValue.advantages.medical"
            :label="$t('bookings.filters.advantages.additional.medical')"
          />
          <UCheckbox
            v-model="modelValue.advantages.firstAid"
            :label="$t('bookings.filters.advantages.additional.firstAid')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SearchFilters } from '~/types/sitter'

defineProps<{
  modelValue: SearchFilters
}>()
</script>
