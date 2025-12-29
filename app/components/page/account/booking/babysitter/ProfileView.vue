<template>
  <div class="space-y-10">
    <div>
      <div class="flex flex-col sm:flex-row gap-8 items-start sm:items-center">
        <div class="w-[140px] h-[140px] rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 flex-shrink-0">
          <img
            v-if="authStore.currentUser?.avatar"
            :src="authStore.currentUser.avatar"
            alt="Фото профиля"
            class="w-full h-full object-cover"
          />
          <div
            v-else
            class="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500"
          >
            <Icon name="mdi:account" size="64" />
          </div>
        </div>
        <div class="flex-1 w-full">
          <div class="grid md:grid-cols-1 gap-6">
            <div>
              <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">{{ t('account.nannyForm.firstName') }}</div>
              <div class="text-base text-gray-900 dark:text-white">{{ profile.firstName || '—' }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">{{ t('account.nannyForm.lastName') }}</div>
              <div class="text-base text-gray-900 dark:text-white">{{ profile.lastName || '—' }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div>
      <div class="grid md:grid-cols-2 gap-6">
        <div>
          <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">{{ t('account.nannyForm.birthDate') }}</div>
          <div class="text-base text-gray-900 dark:text-white">{{ formatDate(profile.birthDate) }}</div>
        </div>
        <div>
          <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">{{ t('account.nannyForm.experience') }}</div>
          <div class="text-base text-gray-900 dark:text-white">
            {{ profile.experience ? `${profile.experience} ${getExperienceLabel(profile.experience)}` : '—' }}
          </div>
        </div>
      </div>
      <div v-if="profile.bio" class="mt-6">
        <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">{{ t('account.nannyForm.about') }}</div>
        <div class="text-base text-gray-900 dark:text-white whitespace-pre-wrap">{{ profile.bio }}</div>
      </div>
    </div>

    <div>
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">{{ t('account.nannyForm.paymentTitle') }}</h2>
      <div class="grid md:grid-cols-3 gap-4 mb-6">
        <div v-for="(field, index) in priceFields" :key="index">
          <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">{{ field.label }}</div>
          <div class="text-base text-gray-900 dark:text-white">
            {{ profile[field.model] ? `${profile[field.model]} ${siteConfig.currency}` : '—' }}
          </div>
        </div>
      </div>
      <div class="grid md:grid-cols-1 gap-6">
        <div>
          <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">{{ t('account.nannyForm.minOrder') }}</div>
          <div class="text-base text-gray-900 dark:text-white">
            {{ profile.minOrderAmount ? `${profile.minOrderAmount} ${siteConfig.currency}` : '—' }}
          </div>
        </div>
        <div>
          <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">{{ t('account.nannyForm.onlineLesson') }}</div>
          <div class="text-base text-gray-900 dark:text-white">
            {{ profile.onlineLesson ? `${profile.onlineLesson} ${siteConfig.currency}` : '—' }}
          </div>
        </div>
        <div v-if="profile.cancellationPolicy">
          <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">{{ t('account.nannyForm.cancellationPolicy') }}</div>
          <div class="text-base text-gray-900 dark:text-white whitespace-pre-wrap">{{ profile.cancellationPolicy }}</div>
        </div>
      </div>
    </div>

    <div>
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">{{ t('account.nannyForm.extraTitle') }}</h2>
      <div class="flex flex-col gap-4 mb-6">
        <div class="flex items-center gap-3">
          <UIcon :name="profile.cardPaymentAvailable ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'"
                 :class="profile.cardPaymentAvailable ? 'text-green-500' : 'text-gray-400'" size="20"/>
          <span class="text-base text-gray-900 dark:text-white">{{ t('account.nannyForm.cardPayment') }}</span>
        </div>
        <div class="flex items-center gap-3">
          <UIcon :name="profile.infantCare ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'"
                 :class="profile.infantCare ? 'text-green-500' : 'text-gray-400'" size="20"/>
          <span class="text-base text-gray-900 dark:text-white">{{ t('account.nannyForm.infantCare') }}</span>
        </div>
        <div class="flex items-center gap-3">
          <UIcon :name="profile.specialNeedsCare ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'"
                 :class="profile.specialNeedsCare ? 'text-green-500' : 'text-gray-400'" size="20"/>
          <span class="text-base text-gray-900 dark:text-white">{{ t('account.nannyForm.specialNeedsCare') }}</span>
        </div>
      </div>

      <div v-if="profile.certifications?.length" class="mb-6">
        <div class="text-sm text-gray-500 dark:text-gray-400 mb-2">{{ t('account.nannyForm.certificates') }}</div>
        <div class="flex flex-wrap gap-2">
          <UBadge v-for="(cert, index) in profile.certifications" :key="index" color="primary" variant="soft">
            {{ cert }}
          </UBadge>
        </div>
      </div>

      <div v-if="profile.advantages?.length" class="mb-6">
        <div class="text-sm text-gray-500 dark:text-gray-400 mb-2">{{ t('account.nannyForm.advantages') }}</div>
        <div class="flex flex-wrap gap-2">
          <UBadge v-for="(advantage, index) in displayedAdvantages" :key="index" color="primary" variant="soft">
            {{ advantage }}
          </UBadge>
        </div>
      </div>

      <div v-if="profile.petAttitude">
        <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">{{ t('account.nannyForm.petAttitude') }}</div>
        <div class="text-base text-gray-900 dark:text-white">{{ profile.petAttitude }}</div>
      </div>
    </div>

    <div v-if="profile.schedules?.length">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">{{ t('account.nannySchedule.title') }}</h2>
      <div class="space-y-4">
        <div v-for="(block, blockIndex) in profile.schedules" :key="blockIndex" class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            {{ getScheduleModeLabel(block.mode) }}
          </div>
          <div class="space-y-2">
            <div v-for="(schedule, scheduleIndex) in block.schedules" :key="scheduleIndex" class="text-sm text-gray-600 dark:text-gray-400">
              <div v-if="block.mode === ScheduleMode.WEEKLY && schedule.dayOfWeek !== undefined" class="mb-1">
                {{ getDayOfWeekLabel(schedule.dayOfWeek) }}
              </div>
              <div v-if="block.mode === ScheduleMode.EVERYDAY && schedule.date" class="mb-1">
                {{ formatDate(schedule.date) }}
              </div>
              <div class="flex flex-wrap gap-2">
                <span v-for="(interval, intervalIndex) in schedule.intervals" :key="intervalIndex" class="text-gray-900 dark:text-white">
                  {{ interval.startTime }} - {{ interval.endTime }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <PageAccountBookingBabysitterShowInSearchBadge
        v-if="profile.showInSearch"
        variant="center"
    />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '#imports'
import type { BabysitterProfilePayload } from '~/composables/useBabysitter'
import { ScheduleMode } from '~/const/schedule'
import { useAdvantages } from '~/composables/useAdvantages'

interface PriceField {
  model: keyof Pick<BabysitterProfilePayload, 'priceOneChild' | 'priceTwoChildren' | 'priceThreeChildren' | 'priceFourChildren' | 'priceFiveChildren'>
  label: string
}

const props = defineProps<{
  profile: BabysitterProfilePayload
  priceFields: PriceField[]
}>()

const { t } = useI18n()
const authStore = useAuthStore()
const siteConfig = useSiteConfig()
const { convertKeysToTranslations, convertAdvantagesToKeys } = useAdvantages()

const displayedAdvantages = computed(() => {
  if (!props.profile.advantages?.length) return []
  const keys = convertAdvantagesToKeys(props.profile.advantages)
  return convertKeysToTranslations(keys)
})

const formatDate = (date?: string | null): string => {
  if (!date) return '—'
  try {
    const d = new Date(date)
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch {
    return date
  }
}

const getExperienceLabel = (years: number): string => {
  const lastDigit = years % 10
  const lastTwoDigits = years % 100
  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return 'лет'
  if (lastDigit === 1) return 'год'
  if (lastDigit >= 2 && lastDigit <= 4) return 'года'
  return 'лет'
}

const getScheduleModeLabel = (mode: string): string => {
  const modeMap: Record<string, string> = {
    [ScheduleMode.WEEKLY]: t('account.nannySchedule.modes.weekly'),
    [ScheduleMode.EVERYDAY]: t('account.nannySchedule.modes.everyday'),
    [ScheduleMode.ALL_DAYS]: t('account.nannySchedule.modes.allDays'),
  }
  return modeMap[mode] || mode
}

const getDayOfWeekLabel = (dayOfWeek: number): string => {
  const weekdaysShort = t('account.nannySchedule.weekdaysShort') as string
  const labels = weekdaysShort.split(',').map(part => part.trim()).filter(Boolean)
  if (labels.length === 7) {
    const weekdayNames = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']
    return weekdayNames[dayOfWeek] || labels[dayOfWeek] || `День ${dayOfWeek}`
  }
  const weekdayNames = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']
  return weekdayNames[dayOfWeek] || `День ${dayOfWeek}`
}
</script>

