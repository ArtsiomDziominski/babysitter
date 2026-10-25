<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-xl font-semibold text-highlighted">{{ t('account.nannyForm.paymentTitle') }}</h2>
      <p class="text-sm text-muted">
        {{ t('account.nannyForm.paymentSubtitle') }}
      </p>
      <p class="text-sm text-muted">
        {{ t('account.nannyForm.extraSubtitle') }}
      </p>
    </div>

    <div>
      <div class="grid md:grid-cols-3 gap-4">
        <div v-for="(field, index) in priceFields" :key="index">
          <label class="block text-sm font-medium text-default mb-2">{{ field.label }}</label>
          <UInput v-model="form[field.model]" type="text" :placeholder="field.placeholder" size="lg"/>
        </div>
      </div>
    </div>

    <div class="grid md:grid-cols-1 gap-6">
      <div>
        <label class="block text-sm font-medium text-default mb-2">
          {{ t('account.nannyForm.minOrder') }}
        </label>
        <UInput v-model="form.minOrderAmount" type="text" :placeholder="t('account.nannyForm.minOrderPlaceholder')" size="lg" />
        <p class="text-xs text-muted mt-1">
          {{ t('account.nannyForm.minOrderHint') }}
        </p>
      </div>
      <div>
        <label class="block text-sm font-medium text-default mb-2">
          {{ t('account.nannyForm.onlineLesson') }}
        </label>
        <UInput
            v-model="form.onlineLesson"
            type="text"
            :placeholder="t('account.nannyForm.onlineLessonPlaceholder')"
            size="lg"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-default mb-2">
          {{ t('account.nannyForm.cancellationPolicy') }}
        </label>
        <textarea
            v-model="form.cancellationPolicy"
            rows="2"
            :placeholder="t('account.nannyForm.cancellationPolicyPlaceholder')"
            class="w-full rounded-lg border border-default bg-transparent px-4 py-3 text-sm text-highlighted focus:outline-none focus:ring-2 focus:ring-primary"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BabysitterProfilePayload } from '~/composables/useBabysitter'

interface PriceField {
  model: keyof Pick<BabysitterProfilePayload, 'priceOneChild' | 'priceTwoChildren' | 'priceThreeChildren' | 'priceFourChildren' | 'priceFiveChildren'>
  label: string
  placeholder: string
}

const form = inject<Ref<BabysitterProfilePayload>>('babysitterForm')
if (!form) {
  throw new Error('babysitterForm is not provided')
}

defineProps<{
  priceFields: PriceField[]
}>()

const { t } = useI18n()
</script>

