<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {{ $t('account.booking.create.startDateTime') }} <span class="text-red-500">*</span>
      </label>
      <div class="flex gap-3">
        <UInput
          :model-value="startDate"
          type="date"
          :min="minDate"
          size="lg"
          required
          class="flex-1"
          @update:model-value="handleStartDateChange"
        />
        <UInput
          :model-value="startTime"
          type="time"
          size="lg"
          required
          class="flex-1"
          @update:model-value="handleStartTimeChange"
        />
      </div>
      <SitterDateAvailabilityStatus
        v-if="startDate"
        :date="startDate"
        :schedule="schedule"
        :selected-time="startTime"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {{ $t('account.booking.create.endDateTime') }} <span class="text-red-500">*</span>
      </label>
      <div class="flex gap-3">
        <UInput
          :model-value="endDate"
          type="date"
          :min="startDate || minDate"
          size="lg"
          required
          class="flex-1"
          @update:model-value="handleEndDateChange"
        />
        <UInput
          :model-value="endTime"
          type="time"
          size="lg"
          required
          class="flex-1"
          @update:model-value="handleEndTimeChange"
        />
      </div>
      <SitterDateAvailabilityStatus
        v-if="endDate"
        :date="endDate"
        :schedule="schedule"
        :selected-time="endTime"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ScheduleSlot } from '~/types/sitter'

const props = defineProps<{
  startDate: string
  startTime: string
  endDate: string
  endTime: string
  schedule?: ScheduleSlot[]
}>()

const emit = defineEmits<{
  'update:startDate': [value: string]
  'update:startTime': [value: string]
  'update:endDate': [value: string]
  'update:endTime': [value: string]
}>()

const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const handleStartDateChange = (value: string) => {
  emit('update:startDate', value)
}

const handleStartTimeChange = (value: string) => {
  emit('update:startTime', value)
}

const handleEndDateChange = (value: string) => {
  emit('update:endDate', value)
}

const handleEndTimeChange = (value: string) => {
  emit('update:endTime', value)
}
</script>

