<template>
  <div class="space-y-10">
    <div class="flex flex-col sm:flex-row gap-8 items-start sm:items-center">
      <div class="flex flex-col items-center gap-2">
        <PageAccountBookingBabysitterPhotoUpload ref="photoUploadRef" />
        <p
          v-if="displayPhotoError"
          class="text-sm text-error-500 dark:text-error-400 text-center"
        >
          {{ t('account.nannyForm.photoRequired') }}
        </p>
      </div>
      <div class="flex-1 w-full space-y-6">
        <div class="space-y-6">
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

    <div class="w-full md:w-1/3">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {{ t('account.nannyForm.city') }}
      </label>
      <USelect
          v-model="selectedCity"
          :items="cityOptions"
          labelKey="label"
          valueKey="value"
          :placeholder="t('account.nannyForm.cityPlaceholder')"
          size="lg"
          class="w-full"
      />
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
import type { BabysitterProfilePayload } from '~/composables/useBabysitter'
import { CITY_KEYS, City } from '~/const/cities'

const form = inject<Ref<BabysitterProfilePayload>>('babysitterForm')
if (!form) {
  throw new Error('babysitterForm is not provided')
}

const { t } = useI18n()
const authStore = useAuthStore()
const photoUploadRef = ref<{ hasPhoto: boolean } | null>(null)
const showPhotoError = inject<Ref<boolean>>('babysitterShowPhotoError', ref(false))

const cityOptions = computed(() =>
    CITY_KEYS.map(key => ({
      label: t(`cities.${ key }`),
      value: key
    }))
)

const selectedCity = computed({
  get: () => {
    const city = form.value.city
    return city ? (city as City) : undefined
  },
  set: (value: City | undefined) => {
    form.value.city = value ?? null
  }
})

const hasPhoto = computed(() => {
  return !!authStore.currentUser?.avatar
})

const displayPhotoError = computed(() => {
  return showPhotoError.value && !hasPhoto.value
})

watch(hasPhoto, (newValue) => {
  if (newValue && showPhotoError.value) {
    showPhotoError.value = false
  }
})

defineExpose({
  validatePhoto: () => {
    return !!authStore.currentUser?.avatar
  }
})
</script>

