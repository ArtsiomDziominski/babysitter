<template>
  <div class="flex-1">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 max-xl:p-4">
      <div class="flex items-center justify-between mb-8 max-xl:mb-4 max-xl:flex-col max-xl:items-stretch max-xl:gap-3">
        <div class="max-xl:w-full">
          <h1 class="text-2xl max-xl:text-xl font-bold text-gray-900 dark:text-white">{{ t('account.nannyForm.title') }}</h1>
          <p class="text-sm max-xl:text-xs text-gray-500 dark:text-gray-400 mt-1">
            {{ t('account.nannyForm.subtitle') }}
          </p>
        </div>
        <PageAccountBookingBabysitterActionButtons
            :has-profile="hasProfile"
            :is-editing="isEditing"
            :is-loading="isLoading"
            :show-in-search="form.showInSearch ?? false"
            @edit="isEditing = true"
            @deleted="handleDeleted"
            @update:show-in-search="form.showInSearch = $event"
        />
      </div>

      <div v-if="isLoading" class="flex items-center justify-center py-12">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-primary animate-spin"/>
      </div>

      <div v-else-if="hasProfile && !isEditing" class="space-y-10">
        <PageAccountBookingBabysitterShowInSearchBadge
            v-if="form.showInSearch"
            variant="top"
        />
        <PageAccountBookingBabysitterProfileView
            :profile="form"
            :price-fields="priceFields"
        />
      </div>

      <div v-else class="space-y-10 max-xl:space-y-6">
        <PageAccountBookingBabysitterPersonalInfoFields ref="personalInfoRef" />

        <PageAccountBookingBabysitterPaymentFields
            :form="form"
            :price-fields="priceFields"
        />

        <PageAccountBookingBabysitterExtraFields />

        <PageAccountBookingBabysitterScheduleSection />

        <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <label class="flex items-center gap-3 text-sm font-medium text-green-700 dark:text-green-400 cursor-pointer">
            <UCheckbox v-model="form.showInSearch"/>
            <span>{{ t('account.nannyForm.showInSearch') }}</span>
          </label>
        </div>

        <div class="flex gap-3 max-xl:flex-col">
          <UButton
              variant="outline"
              :disabled="isSaving || isLoading"
              class="max-xl:w-full"
              @click="handleCancelEdit"
          >
            {{ hasProfile ? t('account.nannyForm.cancel') : t('account.nannyForm.reset') }}
          </UButton>
          <UButton
              color="primary"
              :loading="isSaving"
              :disabled="isLoading"
              class="max-xl:w-full"
              @click="handleSubmit"
          >
            {{ hasProfile ? t('account.nannyForm.update') : t('account.nannyForm.create') }}
          </UButton>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  BabysitterProfilePayload,
  BabysitterSchedule,
  BabysitterScheduleBlock,
  TimeInterval
} from '~/composables/useBabysitter'
import {
  mapEverydaySchedules,
  mapToEverydaySchedules,
  startOfMonth
} from '~/composables/useScheduleTransform'
import { ScheduleMode } from '~/const/schedule'
import { useAdvantages } from '~/composables/useAdvantages'

definePageMeta({
  middleware: ['auth', 'nanny-only']
})

const babysitterApi = useBabysitter()
const authStore = useAuthStore()
const toast = useToast()
const { t, locale } = useI18n()
const { convertAdvantagesToKeys } = useAdvantages()
const route = useRoute()
const siteConfig = useSiteConfig()

const currentUrl = `${siteConfig.url}${route.path}`

useSeoMeta({
  title: () => t('account.nannyForm.title'),
  description: () => t('account.nannyForm.subtitle'),
  ogTitle: () => t('account.nannyForm.title'),
  ogDescription: () => t('account.nannyForm.subtitle'),
  ogImage: `${siteConfig.url}${siteConfig.logo}`,
  ogUrl: currentUrl,
  ogType: 'website',
  ogLocale: locale.value,
  twitterCard: 'summary_large_image',
  twitterTitle: () => t('account.nannyForm.title'),
  twitterDescription: () => t('account.nannyForm.subtitle'),
  twitterImage: `${siteConfig.url}${siteConfig.logo}`,
  robots: 'noindex, nofollow'
})

useHead({
  link: [
    { rel: 'canonical', href: currentUrl }
  ]
})

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
    city: null,
    showInSearch: false,
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
const isEditing = ref(false)
const form = ref<BabysitterProfilePayload>(buildDefaultForm(authStore.currentUser))
const loadedSnapshot = ref<BabysitterProfilePayload | null>(null)
const personalInfoRef = ref<{ validatePhoto: () => boolean } | null>(null)
const showPhotoError = ref(false)

const calendarMonth = ref<Date>(new Date())
const calendarCustomMap = ref<Record<string, TimeInterval[]>>({})

const scheduleMode = ref<ScheduleMode>(ScheduleMode.ALL_DAYS)

const weeklySchedules = ref<BabysitterSchedule[]>([])
const allDaysIntervals = ref<TimeInterval[]>([])
const isRecurringAllDays = ref(false)
const dateSchedules = ref<BabysitterSchedule[]>([])

const priceFields: Array<{
  model: keyof Pick<BabysitterProfilePayload, 'priceOneChild' | 'priceTwoChildren' | 'priceThreeChildren' | 'priceFourChildren' | 'priceFiveChildren'>
  label: string
  placeholder: string
}> = [
  { model: 'priceOneChild', label: t('account.nannyForm.price.one'), placeholder: '700' },
  { model: 'priceTwoChildren', label: t('account.nannyForm.price.two'), placeholder: '1200' },
  { model: 'priceThreeChildren', label: t('account.nannyForm.price.three'), placeholder: '1500' },
]

const formatTimeToHHmm = (time: string): string => {
  if (!time) return ''
  return time.substring(0, 5)
}

const normalizeInterval = (interval: TimeInterval): TimeInterval => ({
  startTime: formatTimeToHHmm(interval?.startTime || ''),
  endTime: formatTimeToHHmm(interval?.endTime || ''),
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
  if (weekly.length) {
    blocks.push({
      mode: ScheduleMode.WEEKLY,
      schedules: weekly,
    })
  }

  const intervals = getNormalizedAllDayIntervals()
  if (intervals.length) {
    blocks.push({
      mode: ScheduleMode.ALL_DAYS,
      schedules: [
        {
          intervals,
        },
      ],
    })
  }

  const everydaySchedules = getEverydaySchedules()
  if (everydaySchedules.length) {
    blocks.push({
      mode: ScheduleMode.EVERYDAY,
      schedules: everydaySchedules,
    })
  }

  return blocks
}

watch(scheduleMode, (mode) => {
  if (mode === ScheduleMode.EVERYDAY) {
    calendarCustomMap.value = mapEverydaySchedules(dateSchedules.value)
  }
})

const applySchedules = (blocks?: BabysitterScheduleBlock[]) => {
  if (!blocks || !blocks.length) {
    scheduleMode.value = ScheduleMode.ALL_DAYS
    weeklySchedules.value = []
    allDaysIntervals.value = []
    isRecurringAllDays.value = false
    dateSchedules.value = []
    calendarCustomMap.value = {}
    return
  }

  const weekly = blocks.find(block => block.mode === ScheduleMode.WEEKLY)
  const allDays = blocks.find(block => block.mode === ScheduleMode.ALL_DAYS)
  const everyday = blocks.find(block => block.mode === ScheduleMode.EVERYDAY)

  calendarCustomMap.value = mapEverydaySchedules(everyday?.schedules)

  if (weekly) {
    scheduleMode.value = ScheduleMode.WEEKLY
    weeklySchedules.value = (weekly.schedules || []).map(item => ({
      dayOfWeek: item.dayOfWeek ?? 1,
      intervals: (item.intervals && item.intervals.length ? item.intervals : []).map(normalizeInterval),
      isRecurring: item.isRecurring ?? weekly.isRecurring ?? false,
    }))
  }

  if (allDays) {
    if (!weekly) {
      scheduleMode.value = ScheduleMode.ALL_DAYS
    }
    const intervals = allDays.schedules?.[0]?.intervals || []
    allDaysIntervals.value = (intervals.length ? intervals : []).map(normalizeInterval)
    isRecurringAllDays.value = allDays.isRecurring ?? false
  }

  if (everyday) {
    if (!weekly && !allDays) {
      scheduleMode.value = ScheduleMode.EVERYDAY
    }
    dateSchedules.value = (everyday.schedules || []).map(item => ({
      date: item.date || '',
      intervals: (item.intervals && item.intervals.length ? item.intervals : []).map(normalizeInterval),
    }))
    return
  }

  scheduleMode.value = ScheduleMode.ALL_DAYS
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
  scheduleMode.value = ScheduleMode.ALL_DAYS
  weeklySchedules.value = []
  allDaysIntervals.value = []
  isRecurringAllDays.value = false
  dateSchedules.value = []
  calendarCustomMap.value = {  }
}

const buildPayload = (): BabysitterProfilePayload => {
  return {
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
    city: normalizeString(form.value.city),
    showInSearch: !!form.value.showInSearch,
    schedules: getCurrentScheduleBlocks(),
  }
}

const loadProfile = async () => {
  isLoading.value = true
  try {
    const profile = await babysitterApi.fetchMyBabysitter()

    if (profile) {
      hasProfile.value = true
      isEditing.value = false
      const convertedProfile = {
        ...profile,
        advantages: profile.advantages ? convertAdvantagesToKeys(profile.advantages) : []
      }
      form.value = convertedProfile
      loadedSnapshot.value = clone(form.value)
      applySchedules(profile.schedules)
    } else {
      resetForm()
    }
  } catch (error: any) {
    toast.add({
      title: t('account.nannyForm.loadError'),
      description: error.message || t('account.nannyForm.tryLater'),
      color: 'error',
    })
    resetForm()
  } finally {
    isLoading.value = false
  }
}

const handleSubmit = async () => {
  if (!authStore.currentUser?.avatar) {
    showPhotoError.value = true
    toast.add({
      title: t('account.nannyForm.photoRequired'),
      description: t('account.nannyForm.photoRequiredDescription'),
      color: 'error',
    })
    return
  }

  showPhotoError.value = false
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
    isEditing.value = false
    toast.add({
      title: t('account.nannyForm.saveSuccess'),
      color: 'success',
    })
    await authStore.fetchProfile()
  } catch (error: any) {
    toast.add({
      title: t('account.nannyForm.saveError'),
      description: error.message || t('account.nannyForm.tryLater'),
      color: 'error',
    })
  } finally {
    isSaving.value = false
  }
}

const handleCancelEdit = () => {
  if (hasProfile.value && loadedSnapshot.value) {
    form.value = clone(loadedSnapshot.value)
    applySchedules(loadedSnapshot.value.schedules)
    isEditing.value = false
  } else {
    resetForm()
  }
}

const handleDeleted = () => {
  hasProfile.value = false
  isEditing.value = false
  resetForm()
}

provide('babysitterForm', form)
provide('babysitterIsSaving', isSaving)
provide('babysitterIsLoading', isLoading)
provide('babysitterDateSchedules', dateSchedules)
provide('babysitterCalendarCustomMap', calendarCustomMap)
provide('babysitterCalendarMonth', calendarMonth)
provide('babysitterWeeklySchedules', weeklySchedules)
provide('babysitterAllDaysIntervals', allDaysIntervals)
provide('babysitterIsRecurringAllDays', isRecurringAllDays)
provide('babysitterShowPhotoError', showPhotoError)

onMounted(() => {
  loadProfile()
})
</script>

