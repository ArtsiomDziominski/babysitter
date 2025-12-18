<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">{{ t('account.nannySchedule.title') }}</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('account.nannySchedule.subtitle') }}</p>
      </div>
    </div>

    <div class="rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <UButton
              variant="ghost"
              color="neutral"
              icon="i-heroicons-chevron-left"
              size="sm"
              class="cursor-pointer"
              @click="goPrev"
          />
          <div class="font-semibold text-gray-900 dark:text-white w-[160px] text-center">
            {{ monthLabel }}
          </div>
          <UButton
              variant="ghost"
              color="neutral"
              icon="i-heroicons-chevron-right"
              size="sm"
              class="cursor-pointer"
              @click="goNext"
          />
        </div>

        <div class="flex items-center gap-2">
          <UButton
              :variant="calendarViewMode === 'week' ? 'solid' : 'ghost'"
              size="sm"
              class="cursor-pointer"
              @click="setViewMode('week')"
          >
            {{ t('account.nannySchedule.weekView') }}
          </UButton>
          <UButton
              :variant="calendarViewMode === 'month' ? 'solid' : 'ghost'"
              size="sm"
              class="cursor-pointer"
              @click="setViewMode('month')"
          >
            {{ t('account.nannySchedule.monthView') }}
          </UButton>
        </div>
      </div>

      <PageAccountBookingBabysitterScheduleMonth
          v-if="calendarViewMode === 'month'"
          :weekday-labels="weekdayLabels"
          :month-grid="monthGrid"
          :empty-text="t('account.nannySchedule.noIntervals')"
          @edit="openEditor"
      />

      <PageAccountBookingBabysitterScheduleWeek
          v-else
          :week-grid="weekGrid"
          :empty-text="t('account.nannySchedule.noIntervals')"
          @edit="openEditor"
      />
    </div>

    <UModal v-model:open="isModalOpen" :title="t('account.nannySchedule.editDay')">
      <template #body>
        <div class="space-y-3">
          <div class="text-sm text-gray-500 dark:text-gray-400">{{ selectedDateLabel }}</div>
          <div
              v-for="(interval, idx) in draftIntervals"
              :key="idx"
              class="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center"
          >
            <UInput v-model="interval.startTime" type="time" size="lg" />
            <UInput v-model="interval.endTime" type="time" size="lg" />
            <div class="flex justify-end">
              <UButton
                  v-if="draftIntervals.length > 1"
                  variant="ghost"
                  color="error"
                  size="sm"
                  @click="removeDraftInterval(idx)"
              >
                {{ t('account.nannySchedule.removeInterval') }}
              </UButton>
            </div>
          </div>
          <UButton variant="outline" size="sm" @click="addDraftInterval">
            {{ t('account.nannySchedule.addInterval') }}
          </UButton>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-3">
          <UButton variant="outline" @click="closeModal">
            {{ t('account.nannySchedule.cancel') }}
          </UButton>
          <UButton color="primary" @click="saveDraft">
            {{ t('account.nannySchedule.save') }}
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from '#imports'
import { addDays, endOfMonth, formatDateKey, startOfMonth, mapToEverydaySchedules } from '~/composables/useScheduleTransform'
import type { TimeInterval } from '~/composables/useBabysitter'
import { ScheduleViewMode } from '~/const/schedule'

const { t } = useI18n()

const calendarMonth = inject<Ref<Date>>('babysitterCalendarMonth')
const calendarCustomMap = inject<Ref<Record<string, TimeInterval[]>>>('babysitterCalendarCustomMap')
const dateSchedules = inject<Ref<any[]>>('babysitterDateSchedules')

if (!calendarMonth || !calendarCustomMap || !dateSchedules) {
  throw new Error('Required calendar state is not provided')
}

const calendarViewMode = ref<ScheduleViewMode>(ScheduleViewMode.WEEK)

const handleCalendarChange = (value: Record<string, TimeInterval[]>) => {
  calendarCustomMap.value = value
  const schedules = mapToEverydaySchedules(calendarCustomMap.value)
  dateSchedules.value = schedules.length ? schedules.map(item => ({ ...item })) : []
}

const handleCalendarMonthChange = (value: string) => {
  const parsed = new Date(value)
  if (!isNaN(parsed.getTime())) {
    calendarMonth.value = startOfMonth(parsed)
  }
}

const handleCalendarViewModeChange = (mode: 'month' | 'week') => {
  calendarViewMode.value = mode as ScheduleViewMode
}

const displayMap = computed(() => calendarCustomMap.value || {})

const parsedMonth = computed(() => calendarMonth.value)

const monthLabel = computed(() =>
    parsedMonth.value.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
)

const calendarMonthValue = computed(() => formatDateKey(calendarMonth.value))

const weekdayLabels = computed(() => {
  const raw = t('account.nannySchedule.weekdaysShort') as string
  const labels = raw.split(',').map(part => part.trim()).filter(Boolean)
  return labels.length === 7 ? labels : ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
})

const monthGrid = computed(() => {
  const start = startOfMonth(parsedMonth.value)
  const end = endOfMonth(parsedMonth.value)
  const days = []

  for (let current = new Date(start); current.getTime() <= end.getTime(); current = addDays(current, 1)) {
    const key = formatDateKey(current)
    days.push({
      key,
      day: current.getDate(),
      intervals: displayMap.value[key] || [],
    })
  }

  return days
})

const weekGrid = computed(() => {
  const current = parsedMonth.value
  const day = current.getDay()
  const diff = (day + 6) % 7
  const weekStart = addDays(current, -diff)

  return Array.from({ length: 7 }).map((_, idx) => {
    const date = addDays(weekStart, idx)
    const key = formatDateKey(date)
    return {
      key,
      label: weekdayLabels.value[idx] || key,
      dateLabel: date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' }),
      intervals: displayMap.value[key] || [],
    }
  })
})

const isModalOpen = ref(false)
const selectedDateKey = ref<string | null>(null)
const draftIntervals = ref<TimeInterval[]>([])

const selectedDateLabel = computed(() => {
  if (!selectedDateKey.value) return ''
  const parsed = new Date(selectedDateKey.value)
  if (isNaN(parsed.getTime())) return selectedDateKey.value
  return parsed.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })
})

const openEditor = (dateKey: string) => {
  selectedDateKey.value = dateKey
  const source = calendarCustomMap.value?.[dateKey] || displayMap.value[dateKey] || []
  draftIntervals.value = source.map(interval => ({ ...interval }))
  if (!draftIntervals.value.length) {
    draftIntervals.value = [{ startTime: '', endTime: '' }]
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  selectedDateKey.value = null
  draftIntervals.value = []
}

const addDraftInterval = () => {
  draftIntervals.value.push({ startTime: '', endTime: '' })
}

const removeDraftInterval = (index: number) => {
  if (draftIntervals.value.length === 1) return
  draftIntervals.value.splice(index, 1)
}

const saveDraft = () => {
  if (!selectedDateKey.value) return
  const clean = draftIntervals.value
      .map(interval => ({
        startTime: interval.startTime?.trim() || '',
        endTime: interval.endTime?.trim() || '',
      }))
      .filter(interval => interval.startTime && interval.endTime)

  const next = { ...calendarCustomMap.value }
  if (clean.length) {
    next[selectedDateKey.value] = clean
  } else {
    delete next[selectedDateKey.value]
  }

  handleCalendarChange(next)
  closeModal()
}

const setViewMode = (mode: 'month' | 'week') => {
  handleCalendarViewModeChange(mode)
}

const goPrev = () => {
  if (calendarViewMode.value === 'month') {
    const next = new Date(parsedMonth.value.getFullYear(), parsedMonth.value.getMonth() - 1, 1)
    handleCalendarMonthChange(formatDateKey(startOfMonth(next)))
  } else {
    const next = addDays(parsedMonth.value, -7)
    handleCalendarMonthChange(formatDateKey(startOfMonth(next)))
  }
}

const goNext = () => {
  if (calendarViewMode.value === 'month') {
    const next = new Date(parsedMonth.value.getFullYear(), parsedMonth.value.getMonth() + 1, 1)
    handleCalendarMonthChange(formatDateKey(startOfMonth(next)))
  } else {
    const next = addDays(parsedMonth.value, 7)
    handleCalendarMonthChange(formatDateKey(startOfMonth(next)))
  }
}
</script>

