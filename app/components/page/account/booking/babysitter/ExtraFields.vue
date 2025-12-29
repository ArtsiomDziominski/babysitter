<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white">{{ t('account.nannyForm.extraTitle') }}</h2>
      <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('account.nannyForm.extraSubtitle') }}</p>
    </div>

    <div class="flex flex-col gap-4">
      <label class="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300">
        <UCheckbox v-model="form.cardPaymentAvailable"/>
        {{ t('account.nannyForm.cardPayment') }}
      </label>
      <label class="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300">
        <UCheckbox v-model="form.infantCare"/>
        {{ t('account.nannyForm.infantCare') }}
      </label>
      <label class="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300">
        <UCheckbox v-model="form.specialNeedsCare"/>
        {{ t('account.nannyForm.specialNeedsCare') }}
      </label>
    </div>

    <div class="flex flex-col gap-6">
      <div>
        <div class="flex items-center gap-3 mb-1">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ t('account.nannyForm.certificates') }}
          </label>
            <UInput
              v-model="newCertification"
              :placeholder="t('account.nannyForm.certificatesPlaceholder')"
              size="sm"
              class="max-w-xs"
              @keyup.enter="addCertification"
          />
          <UButton variant="ghost" size="sm" @click="addCertification">
            {{ t('account.nannyForm.add') }}
          </UButton>
        </div>
        <div class="flex flex-wrap gap-2">
          <UBadge
              v-for="(item, index) in form.certifications"
              :key="index"
              color="primary"
              variant="soft"
              class="flex items-center gap-2"
          >
            <span>{{ item }}</span>
            <button type="button" class="text-xs" @click="removeCertification(index)">×</button>
          </UBadge>
          <span v-if="!form.certifications?.length" class="text-sm text-gray-500 dark:text-gray-400">
            {{ t('account.nannyForm.certificatesEmpty') }}
          </span>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          {{ t('account.nannyForm.advantages') }}
        </label>
        <div class="space-y-2 max-h-96 overflow-y-auto">
          <label
              v-for="advantageKey in advantageKeys"
              :key="advantageKey"
              class="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded"
          >
            <UCheckbox
                :model-value="isAdvantageSelected(advantageKey)"
                @update:model-value="toggleAdvantage(advantageKey, !!$event)"
            />
            <span class="flex-1">{{ t(`bookings.filters.advantages.additional.${advantageKey}`) }}</span>
            <Icon
                v-if="advantageKey === AdvantageKey.AUTISM"
                name="mdi:information-outline"
                size="16"
                class="text-green-500"
            />
          </label>
        </div>
      </div>

      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ t('account.nannyForm.petAttitude') }}
        </label>
        <textarea
            v-model="form.petAttitude"
            type="text"
            class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent px-4 py-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            :placeholder="t('account.nannyForm.petAttitudePlaceholder')"
            rows="1"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '#imports'
import type { BabysitterProfilePayload } from '~/composables/useBabysitter'
import { ADVANTAGE_KEYS, AdvantageKey } from '~/const/advantages'
import { useAdvantages } from '~/composables/useAdvantages'

const form = inject<Ref<BabysitterProfilePayload>>('babysitterForm')
if (!form) {
  throw new Error('babysitterForm is not provided')
}

const emit = defineEmits<{
  'update:advantages': [string[]]
}>()

const { t } = useI18n()
const { convertAdvantagesToKeys } = useAdvantages()

const advantageKeys = ADVANTAGE_KEYS
const newCertification = ref('')

const addCertification = () => {
  const value = newCertification.value.trim()
  if (!value) return
  form.value.certifications = [...(form.value.certifications || []), value]
  newCertification.value = ''
}

const removeCertification = (index: number) => {
  form.value.certifications = (form.value.certifications || []).filter((_, i) => i !== index)
}

const isAdvantageSelected = (key: string): boolean => {
  const currentAdvantages = form.value.advantages || []
  const convertedKeys = convertAdvantagesToKeys(currentAdvantages)
  return convertedKeys.includes(key)
}

const toggleAdvantage = (key: string, checked: boolean) => {
  const currentAdvantages = form.value.advantages || []
  const convertedKeys = convertAdvantagesToKeys(currentAdvantages)

  if (checked) {
    if (!convertedKeys.includes(key)) {
      convertedKeys.push(key)
    }
  } else {
    const index = convertedKeys.indexOf(key)
    if (index > -1) {
      convertedKeys.splice(index, 1)
    }
  }

  form.value.advantages = convertedKeys
}
</script>

