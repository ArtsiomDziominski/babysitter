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
          <div class="font-semibold text-gray-900 dark:text-white w-[200px] text-center">
            {{ calendarViewMode === 'week' ? weekLabel : monthLabel }}
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
          <div class="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
            <label class="flex items-center gap-2 text-sm cursor-pointer">
              <UCheckbox v-model="applyToAllDays" @update:model-value="handleRecurringChange('allDays')" />
              <span class="text-gray-700 dark:text-gray-300">{{ t('account.nannySchedule.applyToAllDays') }}</span>
            </label>
            <label class="flex items-center gap-2 text-sm cursor-pointer">
              <UCheckbox v-model="applyToWeekdays" @update:model-value="handleRecurringChange('weekdays')" />
              <span class="text-gray-700 dark:text-gray-300">{{ t('account.nannySchedule.applyToWeekdays') }}</span>
            </label>
          </div>
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
import { computed, ref, watch } from 'vue'
import { useI18n } from '#imports'
import { addDays, endOfMonth, formatDateKey, startOfMonth, mapToEverydaySchedules, buildDateMapFromBlocks } from '~/composables/useScheduleTransform'
import type { TimeInterval, BabysitterSchedule, BabysitterScheduleBlock } from '~/composables/useBabysitter'
import { ScheduleViewMode } from '~/const/schedule'
import { ScheduleMode } from '~/const/schedule'

const { t } = useI18n()

const calendarMonth = inject<Ref<Date>>('babysitterCalendarMonth')
const calendarCustomMap = inject<Ref<Record<string, TimeInterval[]>>>('babysitterCalendarCustomMap')
const dateSchedules = inject<Ref<any[]>>('babysitterDateSchedules')
const weeklySchedules = inject<Ref<BabysitterSchedule[]>>('babysitterWeeklySchedules')
const allDaysIntervals = inject<Ref<TimeInterval[]>>('babysitterAllDaysIntervals')
const isRecurringAllDays = inject<Ref<boolean>>('babysitterIsRecurringAllDays')

if (!calendarMonth || !calendarCustomMap || !dateSchedules || !weeklySchedules || !allDaysIntervals || !isRecurringAllDays) {
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

const displayMap = computed(() => {
  const blocks: BabysitterScheduleBlock[] = []

  if (allDaysIntervals.value.length > 0) {
    blocks.push({
      mode: ScheduleMode.ALL_DAYS,
      schedules: [{ intervals: allDaysIntervals.value }],
      isRecurring: isRecurringAllDays.value,
    })
  }

  const validWeekly = weeklySchedules.value.filter(s => s.intervals.length > 0)
  if (validWeekly.length > 0) {
    blocks.push({
      mode: ScheduleMode.WEEKLY,
      schedules: validWeekly,
      isRecurring: validWeekly.some(s => s.isRecurring),
    })
  }

  const everydaySchedules = mapToEverydaySchedules(calendarCustomMap.value)
  if (everydaySchedules.length > 0) {
    blocks.push({
      mode: ScheduleMode.EVERYDAY,
      schedules: everydaySchedules,
    })
  }

  if (blocks.length === 0) {
    return calendarCustomMap.value || {}
  }

  const start = startOfMonth(parsedMonth.value)
  const end = endOfMonth(parsedMonth.value)
  const fullMap = buildDateMapFromBlocks(blocks, start, end)

  return { ...fullMap, ...calendarCustomMap.value }
})

const parsedMonth = computed(() => calendarMonth.value)

const monthLabel = computed(() =>
    parsedMonth.value.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
)

const weekLabel = computed(() => {
  const current = parsedMonth.value
  const day = current.getDay()
  const diff = (day + 6) % 7
  const weekStart = addDays(current, -diff)
  const weekEnd = addDays(weekStart, 6)
  
  const startStr = weekStart.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
  const endStr = weekEnd.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
  
  return `${startStr} – ${endStr}`
})

const calendarMonthValue = computed(() => formatDateKey(calendarMonth.value))

const weekdayLabels = computed(() => {
  const raw = t('account.nannySchedule.weekdaysShort') as string
  const labels = raw.split(',').map(part => part.trim()).filter(Boolean)
  return labels.length === 7 ? labels : ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
})

const isPastDate = (dateKey: string): boolean => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const date = new Date(dateKey)
  date.setHours(0, 0, 0, 0)
  return date.getTime() < today.getTime()
}

const monthGrid = computed(() => {
  const start = startOfMonth(parsedMonth.value)
  const end = endOfMonth(parsedMonth.value)
  const days = []

  for (let current = new Date(start); current.getTime() <= end.getTime(); current = addDays(current, 1)) {
    const key = formatDateKey(current)
    const isPast = isPastDate(key)
    days.push({
      key,
      day: current.getDate(),
      intervals: displayMap.value[key] || [],
      isPast,
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
    const isPast = isPastDate(key)
    return {
      key,
      label: weekdayLabels.value[idx] || key,
      dateLabel: date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' }),
      intervals: displayMap.value[key] || [],
      isPast,
    }
  })
})

const isModalOpen = ref(false)
const selectedDateKey = ref<string | null>(null)
const draftIntervals = ref<TimeInterval[]>([])
const applyToAllDays = ref(false)
const applyToWeekdays = ref(false)

const selectedDateLabel = computed(() => {
  if (!selectedDateKey.value) return ''
  const parsed = new Date(selectedDateKey.value)
  if (isNaN(parsed.getTime())) return selectedDateKey.value
  return parsed.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })
})

const getDayOfWeek = (dateKey: string): number => {
  const parsed = new Date(dateKey)
  if (isNaN(parsed.getTime())) return 0
  const day = parsed.getDay()
  return day === 0 ? 7 : day
}

const handleRecurringChange = (type: 'allDays' | 'weekdays') => {
  if (type === 'allDays' && applyToAllDays.value) {
    applyToWeekdays.value = false
  } else if (type === 'weekdays' && applyToWeekdays.value) {
    applyToAllDays.value = false
  }
}

const openEditor = (dateKey: string) => {
  if (isPastDate(dateKey)) {
    return
  }
  
  selectedDateKey.value = dateKey
  const source = calendarCustomMap.value?.[dateKey] || displayMap.value[dateKey] || []
  draftIntervals.value = source.map(interval => ({ ...interval }))
  if (!draftIntervals.value.length) {
    draftIntervals.value = [{ startTime: '', endTime: '' }]
  }

  const dayOfWeek = getDayOfWeek(dateKey)

  applyToAllDays.value = false
  applyToWeekdays.value = false

  if (allDaysIntervals.value.length > 0 && isRecurringAllDays.value) {
    const allDaysBlock = allDaysIntervals.value
    if (JSON.stringify(allDaysBlock.map(i => ({ startTime: i.startTime, endTime: i.endTime })).sort()) ===
        JSON.stringify(source.map(i => ({ startTime: i.startTime, endTime: i.endTime })).sort())) {
      applyToAllDays.value = true
    }
  }

  const weekdays = [1, 2, 3, 4, 5]
  if (weekdays.includes(dayOfWeek)) {
    const weekdaySchedule = weeklySchedules.value.find(s =>
      s.dayOfWeek === dayOfWeek &&
      JSON.stringify(s.intervals.map(i => ({ startTime: i.startTime, endTime: i.endTime }))) ===
      JSON.stringify(source.map(i => ({ startTime: i.startTime, endTime: i.endTime })))
    )
    if (weekdaySchedule?.isRecurring) {
      const allWeekdaysHaveSameSchedule = weekdays.every(dow => {
        const schedule = weeklySchedules.value.find(s => s.dayOfWeek === dow && s.isRecurring)
        return schedule && JSON.stringify(schedule.intervals.map(i => ({ startTime: i.startTime, endTime: i.endTime }))) ===
          JSON.stringify(source.map(i => ({ startTime: i.startTime, endTime: i.endTime })))
      })
      if (allWeekdaysHaveSameSchedule) {
        applyToWeekdays.value = true
      }
    }
  }

  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  selectedDateKey.value = null
  draftIntervals.value = []
  applyToAllDays.value = false
  applyToWeekdays.value = false
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

  if (!clean.length) {
    const next = { ...calendarCustomMap.value }
    delete next[selectedDateKey.value]
    handleCalendarChange(next)
    closeModal()
    return
  }

  const dayOfWeek = getDayOfWeek(selectedDateKey.value)

  if (applyToAllDays.value) {
    allDaysIntervals.value = clean.map(i => ({ ...i }))
    isRecurringAllDays.value = true
    const next = { ...calendarCustomMap.value }
    delete next[selectedDateKey.value]
    handleCalendarChange(next)
  } else if (applyToWeekdays.value) {
    const weekdays = [1, 2, 3, 4, 5]
    weeklySchedules.value = weeklySchedules.value.filter(s =>
      !weekdays.includes(s.dayOfWeek!) || !s.isRecurring
    )
    weekdays.forEach(dow => {
      weeklySchedules.value.push({
        dayOfWeek: dow,
        intervals: clean.map(i => ({ ...i })),
        isRecurring: true,
      })
    })
    const next = { ...calendarCustomMap.value }
    Object.keys(next).forEach(key => {
      const keyDayOfWeek = getDayOfWeek(key)
      if (weekdays.includes(keyDayOfWeek)) {
        delete next[key]
      }
    })
    handleCalendarChange(next)
  } else {
    const next = { ...calendarCustomMap.value }
    if (clean.length) {
      next[selectedDateKey.value] = clean
    } else {
      delete next[selectedDateKey.value]
    }
    handleCalendarChange(next)
  }

  closeModal()
}

const setViewMode = (mode: 'month' | 'week') => {
  handleCalendarViewModeChange(mode)
  if (mode === 'month') {
    calendarMonth.value = startOfMonth(parsedMonth.value)
  } else {
    calendarMonth.value = new Date()
  }
}

const goPrev = () => {
  if (calendarViewMode.value === 'month') {
    const next = new Date(parsedMonth.value.getFullYear(), parsedMonth.value.getMonth() - 1, 1)
    handleCalendarMonthChange(formatDateKey(startOfMonth(next)))
  } else {
    const next = addDays(parsedMonth.value, -7)
    calendarMonth.value = next
  }
}

const goNext = () => {
  if (calendarViewMode.value === 'month') {
    const next = new Date(parsedMonth.value.getFullYear(), parsedMonth.value.getMonth() + 1, 1)
    handleCalendarMonthChange(formatDateKey(startOfMonth(next)))
  } else {
    const next = addDays(parsedMonth.value, 7)
    calendarMonth.value = next
  }
}
</script>

