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
              :model-value="newCertification"
              :placeholder="t('account.nannyForm.certificatesPlaceholder')"
              size="sm"
              class="max-w-xs"
              @update:model-value="emit('update:new-certification', $event)"
              @keyup.enter="emit('add-certification')"
          />
          <UButton variant="ghost" size="sm" @click="emit('add-certification')">
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
            <button type="button" class="text-xs" @click="emit('remove-certification', index)">×</button>
          </UBadge>
          <span v-if="!form.certifications?.length" class="text-sm text-gray-500 dark:text-gray-400">
            {{ t('account.nannyForm.certificatesEmpty') }}
          </span>
        </div>
      </div>

      <div>
        <div class="flex items-center gap-3 mb-1">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ t('account.nannyForm.advantages') }}
          </label>
          <UInput
              :model-value="newAdvantage"
              :placeholder="t('account.nannyForm.advantagesPlaceholder')"
              size="sm"
              class="max-w-xs"
              @update:model-value="emit('update:new-advantage', $event)"
              @keyup.enter="emit('add-advantage')"
          />
          <UButton variant="ghost" size="sm" @click="emit('add-advantage')">
            {{ t('account.nannyForm.add') }}
          </UButton>
        </div>
        <div class="flex flex-wrap gap-2">
          <UBadge
              v-for="(item, index) in form.advantages"
              :key="index"
              color="primary"
              variant="soft"
              class="flex items-center gap-2"
          >
            <span>{{ item }}</span>
            <button type="button" class="text-xs" @click="emit('remove-advantage', index)">×</button>
          </UBadge>
          <span v-if="!form.advantages?.length" class="text-sm text-gray-500 dark:text-gray-400">
            {{ t('account.nannyForm.advantagesEmpty') }}
          </span>
        </div>
      </div>

      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ t('account.nannyForm.petAttitude') }}
        </label>
        <UInput
            v-model="form.petAttitude"
            type="text"
            :placeholder="t('account.nannyForm.petAttitudePlaceholder')"
            size="lg"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '#imports'
import type { BabysitterProfilePayload } from '~/composables/useBabysitter'

defineProps<{
  form: BabysitterProfilePayload
  newCertification: string
  newAdvantage: string
}>()

const emit = defineEmits<{
  'update:new-certification': [string]
  'update:new-advantage': [string]
  'add-certification': []
  'remove-certification': [number]
  'add-advantage': []
  'remove-advantage': [number]
}>()

const { t } = useI18n()
</script>

