<template>
  <div class="space-y-10">
    <div class="grid md:grid-cols-2 gap-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{
            t('account.nannyForm.firstName')
          }}</label>
        <UInput v-model="form.firstName" type="text" :placeholder="t('account.nannyForm.firstName')" size="lg"/>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{
            t('account.nannyForm.lastName')
          }}</label>
        <UInput v-model="form.lastName" type="text" :placeholder="t('account.nannyForm.lastName')" size="lg"/>
      </div>
    </div>

    <div class="grid md:grid-cols-2 gap-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{
            t('account.nannyForm.birthDate')
          }}</label>
        <UInput v-model="form.birthDate" type="date" size="lg"/>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{
            t('account.nannyForm.experience')
          }}</label>
        <UInput v-model="form.experience" type="number" min="0"
                :placeholder="t('account.nannyForm.experiencePlaceholder')" size="lg"/>
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{
          t('account.nannyForm.about')
        }}</label>
      <textarea
          v-model="form.bio"
          rows="4"
          class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent px-4 py-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          :placeholder="t('account.nannyForm.aboutPlaceholder')"
      ></textarea>
    </div>

    <div class="space-y-4">
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
            <UInput v-model="form[field.model]" type="text" :placeholder="field.placeholder" size="lg"/>
          </div>
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{
              t('account.nannyForm.minOrder')
            }}</label>
          <UInput v-model="form.minOrderAmount" type="text" :placeholder="t('account.nannyForm.minOrderPlaceholder')"
                  size="lg"/>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{
              t('account.nannyForm.cancellationPolicy')
            }}</label>
          <UInput v-model="form.cancellationPolicy" type="text"
                  :placeholder="t('account.nannyForm.cancellationPolicyPlaceholder')" size="lg"/>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{
              t('account.nannyForm.onlineLesson')
            }}</label>
          <UInput v-model="form.onlineLesson" type="text" :placeholder="t('account.nannyForm.onlineLessonPlaceholder')"
                  size="lg"/>
        </div>
      </div>
    </div>

    <div class="space-y-4">
      <div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">{{ t('account.nannyForm.extraTitle') }}</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('account.nannyForm.extraSubtitle') }}</p>
      </div>
      <div class="grid md:grid-cols-3 gap-4">
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

      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{
            t('account.nannyForm.petAttitude')
          }}</label>
        <UInput v-model="form.petAttitude" type="text" :placeholder="t('account.nannyForm.petAttitudePlaceholder')"
                size="lg"/>
      </div>


      <div class="grid md:grid-cols-2 gap-6">
        <div>
          <div class="flex items-center gap-3 mb-3">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{
                t('account.nannyForm.certificates')
              }}</label>
            <UInput
                :model-value="newCertification"
                :placeholder="t('account.nannyForm.certificatesPlaceholder')"
                size="sm"
                class="max-w-xs"
                @update:model-value="emit('update:new-certification', $event)"
                @keyup.enter="emit('add-certification')"
            />
            <UButton variant="ghost" size="sm" @click="emit('add-certification')">{{
                t('account.nannyForm.add')
              }}
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
            <span v-if="!form.certifications?.length"
                  class="text-sm text-gray-500 dark:text-gray-400">{{ t('account.nannyForm.certificatesEmpty') }}</span>
          </div>
        </div>

        <div>
          <div class="flex items-center gap-3 mb-3">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{
                t('account.nannyForm.advantages')
              }}</label>
            <UInput
                :model-value="newAdvantage"
                :placeholder="t('account.nannyForm.advantagesPlaceholder')"
                size="sm"
                class="max-w-xs"
                @update:model-value="emit('update:new-advantage', $event)"
                @keyup.enter="emit('add-advantage')"
            />
            <UButton variant="ghost" size="sm" @click="emit('add-advantage')">{{ t('account.nannyForm.add') }}</UButton>
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
            <span v-if="!form.advantages?.length"
                  class="text-sm text-gray-500 dark:text-gray-400">{{ t('account.nannyForm.advantagesEmpty') }}</span>
          </div>
        </div>

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

