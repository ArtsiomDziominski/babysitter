<template>
  <div class="space-y-2">
    <div class="grid grid-cols-7 gap-2 text-xs font-semibold text-muted">
      <div v-for="(label, idx) in weekdayLabels" :key="idx" class="text-center">
        {{ label }}
      </div>
    </div>

    <div class="grid grid-cols-7 gap-2">
      <div
          v-for="slot in monthGrid"
          :key="slot.key"
          :class="[
            'rounded-lg border p-2 min-h-[110px] transition-colors',
            slot.isPast
              ? 'bg-elevated border-accented opacity-60 cursor-not-allowed'
              : slot.intervals.length
                ? 'bg-default border-success-200 dark:border-success-700 hover:border-success-300 dark:hover:border-success-500 hover:bg-success-50 dark:hover:bg-success-900/20 cursor-pointer'
                : 'bg-default border-default hover:border-success-200 dark:hover:border-success-600 hover:bg-success-50 dark:hover:bg-success-900/20 cursor-pointer'
          ]"
          @click="!slot.isPast && $emit('edit', slot.key)"
      >
        <div class="flex items-center justify-between mb-2">
          <span
              :class="[
                'text-sm font-medium',
                slot.isPast
                  ? 'text-dimmed'
                  : 'text-highlighted hover:text-success-600 dark:hover:text-success-300 cursor-pointer'
              ]"
          >
            {{ slot.day }}
          </span>
          <UButton
              v-if="!slot.isPast"
              icon="i-heroicons-pencil-square"
              variant="ghost"
              size="xs"
              color="neutral"
              class="cursor-pointer hover:bg-success-50 hover:text-success-600 dark:hover:bg-success-900/30 dark:hover:text-success-300"
              @click="$emit('edit', slot.key)"
          />
        </div>
        <div class="flex flex-wrap gap-2">
          <UBadge
              v-for="(interval, idx) in slot.intervals"
              :key="idx"
              variant="soft"
              color="success"
              class="bg-success-50 text-success-600 border border-success-100 dark:bg-success-900/30 dark:text-success-300 dark:border-success-800 cursor-text"
              @click.stop
          >
            {{ interval.startTime }} – {{ interval.endTime }}
          </UBadge>
          <div v-if="!slot.intervals.length" class="text-xs text-dimmed">
            {{ emptyText }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TimeInterval } from '~/composables/useBabysitter'

interface MonthSlot {
  key: string
  day: number
  intervals: TimeInterval[]
  isPast: boolean
}

defineProps<{
  weekdayLabels: string[]
  monthGrid: MonthSlot[]
  emptyText: string
}>()

defineEmits<{
  edit: [string]
}>()
</script>

