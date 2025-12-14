<template>
  <div class="p-6 border-b border-gray-200 dark:border-gray-700">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
      {{ $t('bookings.title') }}
    </h1>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <UInput
        v-model="modelValue.address"
        :placeholder="$t('bookings.search.city')"
        icon="i-lucide-map-pin"
        size="lg"
      />
      <UInput
        v-model="modelValue.date"
        type="date"
        :placeholder="$t('bookings.search.date')"
        icon="i-lucide-calendar"
        size="lg"
      />
      <UInput
        v-model="modelValue.timeStart"
        type="time"
        :placeholder="$t('bookings.search.timeStart')"
        icon="i-lucide-clock"
        size="lg"
      />
      <UInput
        v-model="modelValue.timeEnd"
        type="time"
        :placeholder="$t('bookings.search.timeEnd')"
        icon="i-lucide-clock"
        size="lg"
      />
    </div>
    <div class="mt-4 flex justify-end">
      <UButton
        color="primary"
        size="lg"
        @click="$emit('search')"
      >
        {{ $t('bookings.search.submit') }}
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SearchForm } from '~/types/sitter'

defineProps<{
  modelValue: SearchForm
}>()

defineEmits<{
  search: []
}>()
</script>
