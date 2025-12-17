<template>
  <div class="space-y-3">
    <div
        v-for="day in weekGrid"
        :key="day.key"
        :class="[
          'rounded-lg border p-3 bg-white dark:bg-gray-800 cursor-pointer',
          day.intervals.length
            ? 'border-green-200 dark:border-green-700'
            : 'border-gray-200 dark:border-gray-700'
        ]"
        @click="$emit('edit', day.key)"
    >
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-2">
          <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ day.label }}</span>
          <span class="text-xs text-gray-500 dark:text-gray-400">{{ day.dateLabel }}</span>
        </div>
        <UButton
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
}

defineProps<{
  weekGrid: WeekSlot[]
  emptyText: string
}>()

defineEmits<{
  edit: [string]
}>()
</script>

