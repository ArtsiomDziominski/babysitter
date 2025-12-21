<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <div class="p-2 bg-primary/10 rounded-lg">
          <Icon name="i-lucide-calendar" size="24" class="text-primary-500" />
        </div>
        <h3 class="text-xl font-bold text-gray-900 dark:text-white">
          Расписание
        </h3>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="previousPeriod"
          :disabled="isPastPeriod"
          class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        >
          <Icon name="i-lucide-chevron-left" size="20" class="text-gray-600 dark:text-gray-400" />
        </button>
        <button
          @click="nextPeriod"
          class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <Icon name="i-lucide-chevron-right" size="20" class="text-gray-600 dark:text-gray-400" />
        </button>
      </div>
    </div>

    <div class="flex items-center justify-between mb-6">
      <div class="text-lg font-semibold text-gray-900 dark:text-white">
        {{ currentPeriodTitle }}
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="goToToday"
          class="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          Сегодня
        </button>
        <div class="flex gap-2">
          <button
            @click="viewMode = 'week'"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="viewMode === 'week'
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'"
          >
            Неделя
          </button>
          <button
            @click="viewMode = 'month'"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="viewMode === 'month'
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'"
          >
            Месяц
          </button>
        </div>
      </div>
    </div>

    <div v-if="viewMode === 'week'" class="space-y-3">
      <div
        v-for="day in weekDays"
        :key="day.date.toISOString()"
        class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
        :class="isToday(day.date) ? 'bg-primary/5 border-primary-300 dark:border-primary-700' : 'bg-gray-50 dark:bg-gray-700/30'"
      >
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-3">
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
              {{ formatDayName(day.date) }}
            </div>
            <div class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ day.date.getDate() }} {{ formatMonthName(day.date) }}
            </div>
            <div
              v-if="isToday(day.date)"
              class="px-2 py-0.5 bg-primary-500 text-white text-xs font-medium rounded"
            >
              Сегодня
            </div>
          </div>
        </div>
        <div v-if="day.slots && day.slots.length > 0" class="flex flex-wrap gap-2">
          <span
            v-for="slot in day.slots"
            :key="slot"
            class="px-3 py-1.5 bg-primary/10 text-primary-700 dark:text-primary-300 rounded-lg text-sm font-medium"
          >
            {{ slot }}
          </span>
        </div>
        <div v-else class="text-sm text-gray-400 dark:text-gray-500">
          Нет доступного времени
        </div>
      </div>
    </div>

    <div v-else class="space-y-4">
      <div class="grid grid-cols-7 gap-2 mb-2">
        <div
          v-for="dayName in dayNames"
          :key="dayName"
          class="text-center text-sm font-semibold text-gray-500 dark:text-gray-400 py-2"
        >
          {{ dayName }}
        </div>
      </div>
      <div class="grid grid-cols-7 gap-2">
        <div
          v-for="day in monthDays"
          :key="day.date.toISOString()"
          class="min-h-[100px] p-2 rounded-lg border transition-all flex flex-col"
          :class="day.isCurrentMonth
            ? day.slots && day.slots.length > 0
              ? 'bg-primary/5 border-primary-200 dark:border-primary-800 hover:bg-primary/10'
              : isToday(day.date)
                ? 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
            : 'bg-gray-50 dark:bg-gray-900/50 border-gray-100 dark:border-gray-800 opacity-50'"
        >
          <div class="flex items-center justify-between mb-1 flex-shrink-0">
            <span
              class="text-sm font-medium"
              :class="day.isCurrentMonth
                ? 'text-gray-900 dark:text-white'
                : 'text-gray-400 dark:text-gray-600'"
            >
              {{ day.date.getDate() }}
            </span>
            <div
              v-if="isToday(day.date) && day.isCurrentMonth"
              class="w-1.5 h-1.5 bg-primary-500 rounded-full"
            ></div>
          </div>
          <div v-if="day.slots && day.slots.length > 0" class="space-y-1 overflow-y-auto flex-1 scrollbar-hide min-h-0">
            <span
              v-for="(slot, idx) in day.slots"
              :key="idx"
              class="block px-1.5 py-0.5 bg-primary/10 text-primary-700 dark:text-primary-300 rounded text-xs break-words"
              :title="slot"
            >
              {{ formatSlotForMonth(slot) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!sitter.schedule || sitter.schedule.length === 0" class="text-center py-12">
      <Icon name="i-lucide-calendar-x" size="48" class="text-gray-400 mx-auto mb-4" />
      <p class="text-gray-500 dark:text-gray-400 text-lg">
        Расписание не указано
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Sitter, ScheduleSlot } from '~/types/sitter'

const props = defineProps<{
  sitter: Sitter
}>()

const viewMode = ref<'week' | 'month'>('week')
const currentDate = ref(new Date())

const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const fullDayNames = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье']

const currentPeriodTitle = computed(() => {
  if (viewMode.value === 'week') {
    const weekStart = getWeekStart(currentDate.value)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 6)
    return `${formatDateShort(weekStart)} - ${formatDateShort(weekEnd)}`
  } else {
    return currentDate.value.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })
  }
})

const getWeekStart = (date: Date): Date => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  return d
}

const getWeekDays = (): Array<{ date: Date; slots: string[] }> => {
  const weekStart = getWeekStart(currentDate.value)
  const days: Array<{ date: Date; slots: string[] }> = []
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart)
    date.setDate(date.getDate() + i)
    const slots = getSlotsForDate(date)
    days.push({ date, slots })
  }
  
  return days
}

const getMonthDays = (): Array<{ date: Date; slots: string[]; isCurrentMonth: boolean }> => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - (firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1))
  
  const days: Array<{ date: Date; slots: string[]; isCurrentMonth: boolean }> = []
  
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    const isCurrentMonth = date.getMonth() === month && date.getFullYear() === year
    const slots = getSlotsForDate(date)
    days.push({ date, slots, isCurrentMonth })
  }
  
  return days
}

const getSlotsForDate = (date: Date): string[] => {
  if (!props.sitter.schedule || props.sitter.schedule.length === 0) return []
  
  const jsDayOfWeek = date.getDay()
  const apiDayOfWeek = jsDayOfWeek === 0 ? 7 : jsDayOfWeek
  const dateStr = date.toISOString().split('T')[0]
  const dateFormatted = date.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })
  const dayName = fullDayNames[apiDayOfWeek - 1]
  
  const slots: string[] = []
  
  for (const slot of props.sitter.schedule) {
    if (slot.day === 'Все дни') {
      slots.push(...slot.timeSlots)
    } else if (slot.dayOfWeek !== undefined && slot.dayOfWeek === apiDayOfWeek) {
      slots.push(...slot.timeSlots)
    } else if (slot.date && slot.date.split('T')[0] === dateStr) {
      slots.push(...slot.timeSlots)
    } else if (slot.day === dateFormatted || slot.day === dayName) {
      slots.push(...slot.timeSlots)
    }
  }
  
  return [...new Set(slots)]
}

const weekDays = computed(() => getWeekDays())
const monthDays = computed(() => getMonthDays())

const isToday = (date: Date): boolean => {
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

const formatDayName = (date: Date): string => {
  return date.toLocaleDateString('ru-RU', { weekday: 'long' })
}

const formatMonthName = (date: Date): string => {
  return date.toLocaleDateString('ru-RU', { month: 'long' })
}

const formatDateShort = (date: Date): string => {
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

const formatSlotForMonth = (slot: string): string => {
  return slot.replace(' - ', '-')
}

const nextPeriod = () => {
  const newDate = new Date(currentDate.value)
  if (viewMode.value === 'week') {
    newDate.setDate(newDate.getDate() + 7)
  } else {
    newDate.setMonth(newDate.getMonth() + 1)
  }
  currentDate.value = newDate
}

const goToToday = () => {
  currentDate.value = new Date()
}

const isPastPeriod = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  if (viewMode.value === 'week') {
    const currentWeekStart = getWeekStart(currentDate.value)
    const todayWeekStart = getWeekStart(today)
    return currentWeekStart.getTime() <= todayWeekStart.getTime()
  } else {
    const currentMonthStart = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 1)
    const todayMonthStart = new Date(today.getFullYear(), today.getMonth(), 1)
    return currentMonthStart.getTime() <= todayMonthStart.getTime()
  }
})

const previousPeriod = () => {
  if (isPastPeriod.value) return
  
  const newDate = new Date(currentDate.value)
  if (viewMode.value === 'week') {
    newDate.setDate(newDate.getDate() - 7)
    const weekStart = getWeekStart(newDate)
    const todayWeekStart = getWeekStart(new Date())
    if (weekStart.getTime() < todayWeekStart.getTime()) {
      return
    }
  } else {
    newDate.setMonth(newDate.getMonth() - 1)
    const monthStart = new Date(newDate.getFullYear(), newDate.getMonth(), 1)
    const todayMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    if (monthStart.getTime() < todayMonthStart.getTime()) {
      return
    }
  }
  currentDate.value = newDate
}
</script>
