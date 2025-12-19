<template>
  <div class="space-y-3">
    <div
        v-for="day in weekGrid"
        :key="day.key"
        :class="[
          'rounded-lg border p-3 transition-colors',
          day.isPast
            ? 'bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-600 opacity-60 cursor-not-allowed'
            : day.intervals.length
              ? 'bg-white dark:bg-gray-800 border-green-200 dark:border-green-700 cursor-pointer'
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 cursor-pointer'
        ]"
        @click="!day.isPast && $emit('edit', day.key)"
    >
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-2">
          <span
              :class="[
                'text-sm font-semibold',
                day.isPast
                  ? 'text-gray-400 dark:text-gray-600'
                  : 'text-gray-900 dark:text-white'
              ]"
          >
            {{ day.label }}
          </span>
          <span
              :class="[
                'text-xs',
                day.isPast
                  ? 'text-gray-400 dark:text-gray-600'
                  : 'text-gray-500 dark:text-gray-400'
              ]"
          >
            {{ day.dateLabel }}
          </span>
        </div>
        <UButton
            v-if="!day.isPast"
            icon="i-heroicons-pencil-square"
            variant="ghost"
            size="md"
            color="neutral"
            class="h-full cursor-pointer hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-900/30 dark:hover:text-green-400"
            @click="$emit('edit', day.key)"
        />
      </div>
      <div class="flex flex-wrap gap-2">
        <UBadge
            v-for="(interval, idx) in day.intervals"
            :key="idx"
            variant="soft"
            color="success"
            class="bg-green-50 text-green-600 border border-green-100 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800 cursor-text"
            @click.stop
        >
          {{ interval.startTime }} – {{ interval.endTime }}
        </UBadge>
        <span v-if="!day.intervals.length" class="text-xs text-gray-400">
          {{ emptyText }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TimeInterval } from '~/composables/useBabysitter'

interface WeekSlot {
  key: string
  label: string
  dateLabel: string
  intervals: TimeInterval[]
  isPast: boolean
}

defineProps<{
  weekGrid: WeekSlot[]
  emptyText: string
}>()

defineEmits<{
  edit: [string]
}>()
</script>

