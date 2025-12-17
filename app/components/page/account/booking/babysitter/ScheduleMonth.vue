<template>
  <div class="space-y-2">
    <div class="grid grid-cols-7 gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
      <div v-for="(label, idx) in weekdayLabels" :key="idx" class="text-center">
        {{ label }}
      </div>
    </div>

    <div class="grid grid-cols-7 gap-2">
      <div
          v-for="slot in monthGrid"
          :key="slot.key"
          :class="[
            'rounded-lg border p-2 min-h-[110px] bg-white dark:bg-gray-800 cursor-pointer transition-colors',
            slot.intervals.length
              ? 'border-green-200 dark:border-green-700 hover:border-green-300 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20'
              : 'border-gray-200 dark:border-gray-700 hover:border-green-200 dark:hover:border-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
          ]"
          @click="$emit('edit', slot.key)"
      >
        <div class="flex items-center justify-between mb-2">
          <span
              class="text-sm font-medium text-gray-900 dark:text-white hover:text-green-600 dark:hover:text-green-300 cursor-pointer"
          >
            {{ slot.day }}
          </span>
          <UButton
              icon="i-heroicons-pencil-square"
              variant="ghost"
              size="xs"
              color="neutral"
              class="cursor-pointer hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-900/30 dark:hover:text-green-300"
              @click="$emit('edit', slot.key)"
          />
        </div>
        <div class="flex flex-wrap gap-2">
          <UBadge
              v-for="(interval, idx) in slot.intervals"
              :key="idx"
              variant="soft"
              color="success"
              class="bg-green-50 text-green-600 border border-green-100 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800 cursor-text"
              @click.stop
          >
            {{ interval.startTime }} – {{ interval.endTime }}
          </UBadge>
          <div v-if="!slot.intervals.length" class="text-xs text-gray-400">
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

