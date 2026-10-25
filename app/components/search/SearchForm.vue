<template>
  <div>
    <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-highlighted mb-6 max-xl:mb-4">
      {{ $t('bookings.title') }}
    </h1>

    <div class="grid grid-cols-2 xl:grid-cols-4 gap-2 rounded-2xl border border-default bg-default p-2 shadow-sm">
      <USelect
        v-model="selectedCity"
        :items="cityOptions"
        :placeholder="$t('bookings.search.city')"
        labelKey="label"
        valueKey="value"
        icon="i-lucide-map-pin"
        size="xl"
        variant="soft"
      />
      <UInput
        v-model="modelValue.date"
        type="date"
        :placeholder="$t('bookings.search.date')"
        icon="i-lucide-calendar"
        size="xl"
        variant="soft"
      />
      <UInput
        v-model="modelValue.timeStart"
        type="time"
        :placeholder="$t('bookings.search.timeStart')"
        icon="i-lucide-clock"
        size="xl"
        variant="soft"
        class="max-xl:hidden"
      />
      <UInput
        v-model="modelValue.timeEnd"
        type="time"
        :placeholder="$t('bookings.search.timeEnd')"
        icon="i-lucide-clock"
        size="xl"
        variant="soft"
        class="max-xl:hidden"
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
