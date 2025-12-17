<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white">{{ t('account.nannyForm.paymentTitle') }}</h2>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        {{ t('account.nannyForm.paymentSubtitle') }}
      </p>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        {{ t('account.nannyForm.extraSubtitle') }}
      </p>
    </div>

    <div>
      <div class="grid md:grid-cols-3 gap-4">
        <div v-for="(field, index) in priceFields" :key="index">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ field.label }}</label>
          <UInput v-model="form[field.model]" type="text" :placeholder="field.placeholder" size="lg" />
        </div>
      </div>
    </div>

    <div class="grid md:grid-cols-2 gap-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ t('account.nannyForm.minOrder') }}
        </label>
        <UInput v-model="form.minOrderAmount" type="text" :placeholder="t('account.nannyForm.minOrderPlaceholder')" size="lg" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ t('account.nannyForm.cancellationPolicy') }}
        </label>
        <UInput
            v-model="form.cancellationPolicy"
            type="text"
            :placeholder="t('account.nannyForm.cancellationPolicyPlaceholder')"
            size="lg"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ t('account.nannyForm.onlineLesson') }}
        </label>
        <UInput
            v-model="form.onlineLesson"
            type="text"
            :placeholder="t('account.nannyForm.onlineLessonPlaceholder')"
            size="lg"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '#imports'
import type { BabysitterProfilePayload } from '~/composables/useBabysitter'

interface PriceField {
  model: keyof Pick<BabysitterProfilePayload, 'priceOneChild' | 'priceTwoChildren' | 'priceThreeChildren' | 'priceFourChildren' | 'priceFiveChildren'>
  label: string
  placeholder: string
}

defineProps<{
  form: BabysitterProfilePayload
  priceFields: PriceField[]
}>()

const { t } = useI18n()
</script>

