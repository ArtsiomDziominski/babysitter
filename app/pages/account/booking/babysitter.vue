<template>
  <div class="flex-1">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('account.nannyForm.title') }}</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {{ t('account.nannyForm.subtitle') }}
          </p>
        </div>
        <div class="flex gap-3">
          <UButton
              variant="outline"
              :disabled="isSaving || isLoading"
              @click="resetForm"
          >
            {{ t('account.nannyForm.reset') }}
          </UButton>
          <UButton
              color="primary"
              :loading="isSaving"
              :disabled="isLoading"
              @click="handleSubmit"
          >
            {{ hasProfile ? t('account.nannyForm.update') : t('account.nannyForm.create') }}
          </UButton>
        </div>
      </div>

      <div v-if="isLoading" class="flex items-center justify-center py-12">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-primary animate-spin" />
      </div>

      <div v-else class="space-y-10">
        <PageAccountBookingBabysitterProfileFormFields
            :form="form"
            :price-fields="priceFields"
            :new-certification="newCertification"
            :new-advantage="newAdvantage"
            @update:new-certification="newCertification = $event"
            @update:new-advantage="newAdvantage = $event"
            @add-certification="addCertification"
            @remove-certification="removeCertification"
            @add-advantage="addAdvantage"
            @remove-advantage="removeAdvantage"
        />

        <PageAccountBookingBabysitterScheduleSection
            :calendar-custom-map="calendarCustomMap"
            :calendar-display-map="calendarDisplayMap"
            :calendar-month-value="calendarMonthValue"
            :calendar-view-mode="calendarViewMode"
            :handle-calendar-change="handleCalendarChange"
            :handle-calendar-month-change="handleCalendarMonthChange"
            :handle-calendar-view-mode-change="handleCalendarViewModeChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  BabysitterProfilePayload,
  BabysitterScheduleBlock,
  BabysitterSchedule,
  TimeInterval,
  ScheduleMode
} from '~/composables/useBabysitter'
import {
  buildDateMapFromBlocks,
  endOfMonth,
  formatDateKey,
  mapEverydaySchedules,
  mapToEverydaySchedules,
  startOfMonth
} from '~/composables/useScheduleTransform'
import { useI18n } from '#imports'
import { ScheduleViewMode } from '~/const/schedule'

definePageMeta({
  middleware: ['auth', 'nanny-only']
})

const babysitterApi = useBabysitter()
const authStore = useAuthStore()
const toast = useToast()
const { t } = useI18n()

function createInterval(): TimeInterval {
  return { startTime: '', endTime: '' }
}

function buildDefaultForm(user?: { name?: string; surname?: string }): BabysitterProfilePayload {
  return {
    experience: null,
    firstName: user?.name ?? '',
    lastName: user?.surname ?? '',
    certifications: [],
    bio: '',
    cardPaymentAvailable: true,
    minOrderAmount: '',
    priceOneChild: '',
    priceTwoChildren: '',
    priceThreeChildren: '',
    priceFourChildren: '',
    priceFiveChildren: '',
    onlineLesson: '',
    cancellationPolicy: '',
    infantCare: false,
    specialNeedsCare: false,
    petAttitude: '',
    advantages: [],
    birthDate: '',
    schedules: [],
  }
}

const normalizeString = (value?: string | null) => {
  if (value === undefined || value === null) return null
  const trimmed = value.toString().trim()
  return trimmed ? trimmed : null
}

const normalizeNumber = (value?: number | null) => {
  if (value === undefined || value === null) return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value))

const isLoading = ref(true)
const isSaving = ref(false)
const hasProfile = ref(false)
const form = ref<BabysitterProfilePayload>(buildDefaultForm(authStore.currentUser))
const loadedSnapshot = ref<BabysitterProfilePayload | null>(null)

const calendarMonth = ref<Date>(startOfMonth(new Date()))
const calendarViewMode = ref<ScheduleViewMode>(ScheduleViewMode.WEEK)
const calendarCustomMap = ref<Record<string, TimeInterval[]>>({})

const scheduleMode = ref<ScheduleMode>('allDays')

const weeklySchedules = ref<BabysitterSchedule[]>([])
const allDaysIntervals = ref<TimeInterval[]>([])
const dateSchedules = ref<BabysitterSchedule[]>([])

const newCertification = ref('')
const newAdvantage = ref('')

const priceFields: Array<{
  model: keyof Pick<BabysitterProfilePayload, 'priceOneChild' | 'priceTwoChildren' | 'priceThreeChildren' | 'priceFourChildren' | 'priceFiveChildren'>
  label: string
  placeholder: string
}> = [
  { model: 'priceOneChild', label: t('account.nannyForm.price.one'), placeholder: '700' },
  { model: 'priceTwoChildren', label: t('account.nannyForm.price.two'), placeholder: '1200' },
  { model: 'priceThreeChildren', label: t('account.nannyForm.price.three'), placeholder: '1500' },
  { model: 'priceFourChildren', label: t('account.nannyForm.price.four'), placeholder: '1800' },
  { model: 'priceFiveChildren', label: t('account.nannyForm.price.fivePlus'), placeholder: '2000' },
]

const calendarDisplayMap = computed(() => {
  const blocks = getCurrentScheduleBlocks()
  return buildDateMapFromBlocks(blocks, startOfMonth(calendarMonth.value), endOfMonth(calendarMonth.value))
})

const calendarMonthValue = computed(() => formatDateKey(calendarMonth.value))

const normalizeInterval = (interval: TimeInterval): TimeInterval => ({
  startTime: interval?.startTime || '',
  endTime: interval?.endTime || '',
})

const getNormalizedWeeklySchedules = () => {
  return weeklySchedules.value
      .map(item => ({
        dayOfWeek: item.dayOfWeek,
        intervals: item.intervals
            .map(normalizeInterval)
            .filter(interval => interval.startTime && interval.endTime),
      }))
      .filter(item => item.dayOfWeek !== undefined && item.intervals.length)
}

const getNormalizedAllDayIntervals = () => {
  return allDaysIntervals.value
      .map(normalizeInterval)
      .filter(interval => interval.startTime && interval.endTime)
}

const getEverydaySchedules = () => {
  const fromMap = mapToEverydaySchedules(calendarCustomMap.value)
  if (fromMap.length) return fromMap

  return dateSchedules.value
      .map(item => ({
        date: item.date,
        intervals: item.intervals
            .map(normalizeInterval)
            .filter(interval => interval.startTime && interval.endTime),
      }))
      .filter(item => item.date && item.intervals.length)
}

const getCurrentScheduleBlocks = (): BabysitterScheduleBlock[] => {
  const blocks: BabysitterScheduleBlock[] = []

  const weekly = getNormalizedWeeklySchedules()
  if (scheduleMode.value === 'weekly' && weekly.length) {
    blocks.push({
      mode: 'weekly',
      schedules: weekly,
    })
  }

  if (scheduleMode.value === 'allDays') {
    const intervals = getNormalizedAllDayIntervals()
    if (intervals.length) {
      blocks.push({
        mode: 'allDays',
        schedules: [
          {
            intervals,
          },
        ],
      })
    }
  }

  const everydaySchedules = getEverydaySchedules()
  if (everydaySchedules.length && (scheduleMode.value === 'everyday' || Object.keys(calendarCustomMap.value).length)) {
    blocks.push({
      mode: 'everyday',
      schedules: everydaySchedules,
    })
  }

  return blocks
}

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

const syncCalendarFromDates = () => {
  if (scheduleMode.value !== 'everyday') return
  calendarCustomMap.value = mapEverydaySchedules(dateSchedules.value)
}

watch(scheduleMode, (mode) => {
  if (mode === 'everyday') {
    calendarCustomMap.value = mapEverydaySchedules(dateSchedules.value)
  }
})

const applySchedules = (blocks?: BabysitterScheduleBlock[]) => {
  if (!blocks || !blocks.length) {
    scheduleMode.value = 'allDays'
    weeklySchedules.value = []
    allDaysIntervals.value = []
    dateSchedules.value = []
    calendarCustomMap.value = {}
    return
  }

  const weekly = blocks.find(block => block.mode === 'weekly')
  const allDays = blocks.find(block => block.mode === 'allDays')
  const everyday = blocks.find(block => block.mode === 'everyday')

  calendarCustomMap.value = mapEverydaySchedules(everyday?.schedules)

  if (weekly) {
    scheduleMode.value = 'weekly'
    weeklySchedules.value = (weekly.schedules || []).map(item => ({
      dayOfWeek: item.dayOfWeek ?? 1,
      intervals: (item.intervals && item.intervals.length ? item.intervals : []).map(normalizeInterval),
    }))
  }

  if (allDays) {
    if (!weekly) {
      scheduleMode.value = 'allDays'
    }
    const intervals = allDays.schedules?.[0]?.intervals || []
    allDaysIntervals.value = (intervals.length ? intervals : []).map(normalizeInterval)
  }

  if (everyday) {
    if (!weekly && !allDays) {
      scheduleMode.value = 'everyday'
    }
    dateSchedules.value = (everyday.schedules || []).map(item => ({
      date: item.date || '',
      intervals: (item.intervals && item.intervals.length ? item.intervals : []).map(normalizeInterval),
    }))
    return
  }

  scheduleMode.value = 'allDays'
  allDaysIntervals.value = []
}

const resetForm = () => {
  if (loadedSnapshot.value) {
    form.value = clone(loadedSnapshot.value)
    applySchedules(loadedSnapshot.value.schedules)
    return
  }

  form.value = buildDefaultForm(authStore.currentUser)
  hasProfile.value = false
  scheduleMode.value = 'allDays'
  weeklySchedules.value = []
  allDaysIntervals.value = []
  dateSchedules.value = []
  calendarCustomMap.value = {}
}

const addWeeklyDay = () => {
  weeklySchedules.value.push({ dayOfWeek: 1, intervals: [createInterval()] })
}

const removeWeeklyDay = (index: number) => {
  if (weeklySchedules.value.length === 1) return
  weeklySchedules.value.splice(index, 1)
}

const addWeeklyInterval = (dayIndex: number) => {
  const day = weeklySchedules.value[dayIndex]
  if (!day) return
  day.intervals.push(createInterval())
}

const removeWeeklyInterval = (dayIndex: number, intervalIndex: number) => {
  const day = weeklySchedules.value[dayIndex]
  if (!day) return
  if (day.intervals.length === 1) return
  day.intervals.splice(intervalIndex, 1)
}

const addAllDayInterval = () => {
  allDaysIntervals.value.push(createInterval())
}

const removeAllDayInterval = (index: number) => {
  if (allDaysIntervals.value.length === 1) return
  allDaysIntervals.value.splice(index, 1)
}

const addDateSchedule = () => {
  dateSchedules.value.push({ date: '', intervals: [] })
  syncCalendarFromDates()
}

const removeDateSchedule = (index: number) => {
  if (dateSchedules.value.length === 1) return
  dateSchedules.value.splice(index, 1)
  syncCalendarFromDates()
}

const addDateInterval = (scheduleIndex: number) => {
  const schedule = dateSchedules.value[scheduleIndex]
  if (!schedule) return
  schedule.intervals.push(createInterval())
  syncCalendarFromDates()
}

const removeDateInterval = (scheduleIndex: number, intervalIndex: number) => {
  const schedule = dateSchedules.value[scheduleIndex]
  if (!schedule) return
  if (schedule.intervals.length === 1) return
  schedule.intervals.splice(intervalIndex, 1)
  syncCalendarFromDates()
}

const addCertification = () => {
  const value = newCertification.value.trim()
  if (!value) return
  form.value.certifications = [...(form.value.certifications || []), value]
  newCertification.value = ''
}

const removeCertification = (index: number) => {
  form.value.certifications = (form.value.certifications || []).filter((_, i) => i !== index)
}

const addAdvantage = () => {
  const value = newAdvantage.value.trim()
  if (!value) return
  form.value.advantages = [...(form.value.advantages || []), value]
  newAdvantage.value = ''
}

const removeAdvantage = (index: number) => {
  form.value.advantages = (form.value.advantages || []).filter((_, i) => i !== index)
}

const buildSchedulesPayload = (): BabysitterScheduleBlock[] => {
  const blocks = getCurrentScheduleBlocks()
  return blocks
}

const buildPayload = (): BabysitterProfilePayload => {
  const payload: BabysitterProfilePayload = {
    experience: normalizeNumber(form.value.experience),
    firstName: normalizeString(form.value.firstName),
    lastName: normalizeString(form.value.lastName),
    certifications: (form.value.certifications || []).map(item => item.trim()).filter(Boolean),
    bio: normalizeString(form.value.bio) ?? '',
    cardPaymentAvailable: !!form.value.cardPaymentAvailable,
    minOrderAmount: normalizeString(form.value.minOrderAmount),
    priceOneChild: normalizeString(form.value.priceOneChild),
    priceTwoChildren: normalizeString(form.value.priceTwoChildren),
    priceThreeChildren: normalizeString(form.value.priceThreeChildren),
    priceFourChildren: normalizeString(form.value.priceFourChildren),
    priceFiveChildren: normalizeString(form.value.priceFiveChildren),
    onlineLesson: normalizeString(form.value.onlineLesson),
    cancellationPolicy: normalizeString(form.value.cancellationPolicy),
    infantCare: !!form.value.infantCare,
    specialNeedsCare: !!form.value.specialNeedsCare,
    petAttitude: normalizeString(form.value.petAttitude),
    advantages: (form.value.advantages || []).map(item => item.trim()).filter(Boolean),
    birthDate: normalizeString(form.value.birthDate),
    schedules: buildSchedulesPayload(),
  }

  return payload
}

const loadProfile = async () => {
  isLoading.value = true
  try {
    const profile = await babysitterApi.fetchMyBabysitter()

    if (profile) {
      hasProfile.value = true
      form.value = {
        ...buildDefaultForm(authStore.currentUser),
        ...profile,
        experience: profile.experience ?? null,
        firstName: authStore.currentUser?.name ?? '',
        lastName: authStore.currentUser?.surname ?? '',
        bio: profile.bio ?? '',
        minOrderAmount: profile.minOrderAmount ?? '',
        priceOneChild: profile.priceOneChild ?? '',
        priceTwoChildren: profile.priceTwoChildren ?? '',
        priceThreeChildren: profile.priceThreeChildren ?? '',
        priceFourChildren: profile.priceFourChildren ?? '',
        priceFiveChildren: profile.priceFiveChildren ?? '',
        onlineLesson: profile.onlineLesson ?? '',
        cancellationPolicy: profile.cancellationPolicy ?? '',
        petAttitude: profile.petAttitude ?? '',
        birthDate: profile.birthDate ?? '',
        certifications: profile.certifications || [],
        advantages: profile.advantages || [],
        schedules: profile.schedules || [],
      }
      loadedSnapshot.value = clone(form.value)
      applySchedules(profile.schedules)
    } else {
      resetForm()
    }
  } catch (error: any) {
    toast.add({
      title: 'Не удалось загрузить профиль',
      description: error.message || 'Попробуйте позже',
      color: 'error',
    })
    resetForm()
  } finally {
    isLoading.value = false
  }
}

const handleSubmit = async () => {
  isSaving.value = true
  try {
    const payload = buildPayload()
    const response = hasProfile.value
        ? await babysitterApi.updateBabysitter(payload)
        : await babysitterApi.createBabysitter(payload)

    form.value = {
      ...form.value,
      ...response,
      schedules: response.schedules ?? payload.schedules,
    }
    loadedSnapshot.value = clone(form.value)
    hasProfile.value = true
    toast.add({
      title: 'Профиль сохранен',
      color: 'success',
    })
    await authStore.fetchProfile()
  } catch (error: any) {
    toast.add({
      title: 'Ошибка сохранения',
      description: error.message || 'Попробуйте позже',
      color: 'error',
    })
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  loadProfile()
})
</script>

