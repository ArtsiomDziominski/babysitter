<template>
  <UModal v-model:open="isOpen" :title="$t('bookings.filters.title')" :ui="{ wrapper: 'items-end' }">
    <template #body>
      <div class="space-y-6 max-h-[70vh] overflow-y-auto">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ $t('bookings.search.timeStart') }}
          </label>
          <UInput
              v-model="localSearchForm.timeStart"
              type="time"
              :placeholder="$t('bookings.search.timeStart')"
              icon="i-lucide-clock"
              size="lg"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ $t('bookings.search.timeEnd') }}
          </label>
          <UInput
              v-model="localSearchForm.timeEnd"
              type="time"
              :placeholder="$t('bookings.search.timeEnd')"
              icon="i-lucide-clock"
              size="lg"
          />
        </div>

        <SearchFilters v-model="localFilters" class="!w-full !border-r-0 !p-0"/>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton
            color="neutral"
            variant="ghost"
            @click="handleClose"
        >
          {{ $t('common.cancel') || 'Отмена' }}
        </UButton>
        <UButton
            color="primary"
            @click="handleApply"
        >
          {{ $t('common.apply') || 'Применить' }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { SearchFilters, SearchForm } from '~/types/sitter'

const props = defineProps<{
  modelValue: boolean
  searchForm: SearchForm
  filters: SearchFilters
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'update:searchForm': [value: SearchForm]
  'update:filters': [value: SearchFilters]
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const localSearchForm = computed({
  get: () => props.searchForm,
  set: (value) => emit('update:searchForm', value)
})

const localFilters = computed({
  get: () => props.filters,
  set: (value) => emit('update:filters', value)
})

const handleClose = () => {
  isOpen.value = false
}

const handleApply = () => {
  emit('update:searchForm', localSearchForm.value)
  emit('update:filters', localFilters.value)
  isOpen.value = false
}
</script>

