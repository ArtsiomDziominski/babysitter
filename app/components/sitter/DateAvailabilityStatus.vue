<template>
  <div class="mt-2">
    <div
      class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
      :class="statusClasses"
    >
      <Icon :name="statusIcon" size="16" />
      <span>{{ availabilityStatus.message }}</span>
    </div>
    <div v-if="availabilityStatus.slots && availabilityStatus.slots.length > 0" class="mt-2">
      <p class="text-xs text-muted mb-1">
        Доступное время:
      </p>
      <div class="flex flex-wrap gap-1.5">
        <span
          v-for="slot in availabilityStatus.slots"
          :key="slot"
          class="px-2 py-1 bg-primary/10 text-primary-700 dark:text-primary-300 rounded text-xs font-medium"
        >
          {{ slot }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ScheduleSlot } from '~/types/sitter'

interface Props {
  date: string
  schedule?: ScheduleSlot[]
  selectedTime?: string
}

const props = defineProps<Props>()

const availabilityStatus = computed(() => {
  if (!props.date) {
    return {
      type: 'no-date',
      message: 'Выберите дату',
      slots: []
    }
  }

  if (!props.schedule || props.schedule.length === 0) {
    return {
      type: 'no-schedule',
      message: 'Расписание не указано',
      slots: []
    }
  }

  const selectedDate = new Date(props.date)
  const jsDayOfWeek = selectedDate.getDay()
  const apiDayOfWeek = jsDayOfWeek === 0 ? 7 : jsDayOfWeek
  const dateStr = selectedDate.toISOString().split('T')[0]
  const dateFormatted = selectedDate.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })
  const fullDayNames = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье']
  const dayName = fullDayNames[apiDayOfWeek - 1]

  const slots: string[] = []

  for (const slot of props.schedule) {
    if (!slot.timeSlots || slot.timeSlots.length === 0) continue
    
    if (slot.day === 'Все дни') {
      slots.push(...slot.timeSlots)
    } else if (slot.dayOfWeek !== undefined) {
      let slotDayOfWeek = slot.dayOfWeek
      if (slotDayOfWeek === 0) slotDayOfWeek = 7
      if (slotDayOfWeek === apiDayOfWeek) {
        slots.push(...slot.timeSlots)
      }
    } else if (slot.date) {
      const slotDateStr = slot.date.split('T')[0]
      if (slotDateStr === dateStr) {
        slots.push(...slot.timeSlots)
      }
    } else if (slot.day) {
      if (slot.day === dateFormatted || slot.day === dayName) {
        slots.push(...slot.timeSlots)
      }
    }
  }

  const uniqueSlots = [...new Set(slots)].filter(Boolean)

  if (uniqueSlots.length === 0) {
    return {
      type: 'not-working',
      message: 'Бебиситтер не работает в этот день',
      slots: []
    }
  }

  if (uniqueSlots.length === 0) {
    return {
      type: 'not-working',
      message: 'Бебиситтер не работает в этот день',
      slots: []
    }
  }

  const isTimeValid = props.selectedTime ? checkTimeInSlots(props.selectedTime, uniqueSlots) : null

  if (isTimeValid === false) {
    return {
      type: 'time-invalid',
      message: 'Выбранное время недоступно. Выберите время из доступных слотов.',
      slots: uniqueSlots,
      isTimeValid: false
    }
  }

  return {
    type: 'available',
    message: `Доступно ${uniqueSlots.length} временных слотов`,
    slots: uniqueSlots,
    isTimeValid
  }
})

const checkTimeInSlots = (selectedTime: string, slots: string[]): boolean => {
  if (!selectedTime || slots.length === 0) return true
  
  const [selectedHour, selectedMinute] = selectedTime.split(':').map(Number)
  const selectedMinutes = selectedHour * 60 + selectedMinute

  for (const slot of slots) {
    const [timeRange] = slot.split(' - ')
    if (!timeRange) continue
    
    const [startHour, startMinute] = timeRange.split(':').map(Number)
    const startMinutes = startHour * 60 + startMinute
    
    const endPart = slot.includes(' - ') ? slot.split(' - ')[1] : null
    if (endPart) {
      const [endHour, endMinute] = endPart.split(':').map(Number)
      const endMinutes = endHour * 60 + endMinute
      
      if (selectedMinutes >= startMinutes && selectedMinutes <= endMinutes) {
        return true
      }
    } else {
      if (selectedMinutes === startMinutes) {
        return true
      }
    }
  }
  
  return false
}

const statusClasses = computed(() => {
  switch (availabilityStatus.value.type) {
    case 'available':
      return 'bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-300 border border-success-200 dark:border-success-800'
    case 'time-invalid':
      return 'bg-error-50 dark:bg-error-900/20 text-error-700 dark:text-error-300 border border-error-200 dark:border-error-800'
    case 'not-working':
      return 'bg-warning-50 dark:bg-warning-900/20 text-warning-700 dark:text-warning-300 border border-warning-200 dark:border-warning-800'
    case 'no-schedule':
      return 'bg-muted text-toned border border-default'
    case 'no-date':
      return 'bg-muted text-toned border border-default'
    default:
      return 'bg-muted text-toned border border-default'
  }
})

const statusIcon = computed(() => {
  switch (availabilityStatus.value.type) {
    case 'available':
      return 'i-lucide-check-circle'
    case 'time-invalid':
      return 'i-lucide-alert-circle'
    case 'not-working':
      return 'i-lucide-calendar-x'
    case 'no-schedule':
      return 'i-lucide-info'
    default:
      return 'i-lucide-info'
  }
})
</script>

