<template>
  <div class="p-6 border-b border-gray-200 dark:border-gray-700">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
      {{ $t('bookings.title') }}
    </h1>

    <div class="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1fr] gap-4">
      <USelect
        v-model="selectedCity"
        :items="cityOptions"
        :placeholder="$t('bookings.search.city')"
        labelKey="label"
        valueKey="value"
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
      <!-- <UButton
        color="primary"
        size="sm"
        @click="$emit('search')"
      >
        {{ $t('bookings.search.submit') }}
      </UButton> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SearchForm } from '~/types/sitter'
import { CITY_KEYS, City } from '~/const/cities'

const props = defineProps<{
  modelValue: SearchForm
}>()

const emit = defineEmits<{
  search: []
  'update:modelValue': [value: SearchForm]
}>()

const { t } = useI18n()

const cityOptions = computed(() =>
    CITY_KEYS.map(key => ({
      label: t(`cities.${ key }`),
      value: key
    }))
)

const selectedCity = computed({
  get: () => {
    const address = props.modelValue.address
    return address ? (address as City) : undefined
  },
  set: (value: City | undefined) => {
    emit('update:modelValue', {
      ...props.modelValue,
      address: value || ''
    })
  }
})
</script>
