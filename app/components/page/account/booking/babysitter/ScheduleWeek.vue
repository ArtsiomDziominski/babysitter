<template>
  <div class="space-y-3">
    <div
        v-for="day in weekGrid"
        :key="day.key"
        :class="[
          'rounded-lg border p-3 transition-colors',
          day.isPast
            ? 'bg-elevated border-accented opacity-60 cursor-not-allowed'
            : day.intervals.length
              ? 'bg-default border-success-200 dark:border-success-700 cursor-pointer'
              : 'bg-default border-default cursor-pointer'
        ]"
        @click="!day.isPast && $emit('edit', day.key)"
    >
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-2">
          <span
              :class="[
                'text-sm font-semibold',
                day.isPast
                  ? 'text-dimmed'
                  : 'text-highlighted'
              ]"
          >
            {{ day.label }}
          </span>
          <span
              :class="[
                'text-xs',
                day.isPast
                  ? 'text-dimmed'
                  : 'text-muted'
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
            class="h-full cursor-pointer hover:bg-success-50 hover:text-success-600 dark:hover:bg-success-900/30 dark:hover:text-success-400"
            @click="$emit('edit', day.key)"
        />
      </div>
      <div class="flex flex-wrap gap-2">
        <UBadge
            v-for="(interval, idx) in day.intervals"
            :key="idx"
            variant="soft"
            color="success"
            class="bg-success-50 text-success-600 border border-success-100 dark:bg-success-900/30 dark:text-success-300 dark:border-success-800 cursor-text"
            @click.stop
        >
          {{ interval.startTime }} – {{ interval.endTime }}
        </UBadge>
        <span v-if="!day.intervals.length" class="text-xs text-dimmed">
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

