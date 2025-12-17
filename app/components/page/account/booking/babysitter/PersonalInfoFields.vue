<template>
  <div class="space-y-10">
    <div class="grid md:grid-cols-2 gap-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ t('account.nannyForm.firstName') }}
        </label>
        <UInput v-model="form.firstName" type="text" :placeholder="t('account.nannyForm.firstName')" size="lg" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ t('account.nannyForm.lastName') }}
        </label>
        <UInput v-model="form.lastName" type="text" :placeholder="t('account.nannyForm.lastName')" size="lg" />
      </div>
    </div>

    <div class="grid md:grid-cols-2 gap-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ t('account.nannyForm.birthDate') }}
        </label>
        <UInput v-model="form.birthDate" type="date" size="lg" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ t('account.nannyForm.experience') }}
        </label>
        <UInput
            v-model="form.experience"
            type="number"
            min="0"
            :placeholder="t('account.nannyForm.experiencePlaceholder')"
            size="lg"
        />
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {{ t('account.nannyForm.about') }}
      </label>
      <textarea
          v-model="form.bio"
          rows="4"
          class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent px-4 py-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          :placeholder="t('account.nannyForm.aboutPlaceholder')"
      ></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '#imports'
import type { BabysitterProfilePayload } from '~/composables/useBabysitter'

defineProps<{
  form: BabysitterProfilePayload
}>()

const { t } = useI18n()
</script>

