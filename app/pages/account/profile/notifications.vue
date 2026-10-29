<template>
  <div class="flex-1">
    <div class="bg-default rounded-xl border border-default p-6 sm:p-8 max-xl:p-4">
      <h1 class="text-2xl max-xl:text-xl font-bold text-highlighted mb-8 max-xl:mb-4">
        {{ $t('account.notifications.title') }}
      </h1>

      <form @submit.prevent="handleSave" class="space-y-8 max-xl:space-y-6">
        <div class="space-y-4 max-xl:space-y-3">
          <h2 class="text-lg max-xl:text-base font-semibold text-highlighted">
            {{ $t('account.notifications.emailNotifications') }}
          </h2>
          <div class="space-y-4 max-xl:space-y-3 pl-4 max-xl:pl-2">
            <div
                v-for="option in options"
                :key="option.key"
                class="flex items-center justify-between max-xl:flex-col max-xl:items-stretch max-xl:gap-2"
            >
              <div class="flex-1 max-xl:w-full">
                <label :for="`notify-${option.key}`" class="text-sm max-xl:text-xs font-medium text-default">
                  {{ $t(option.label) }}
                </label>
                <p class="text-xs max-xl:text-[10px] text-muted mt-1">
                  {{ $t(option.description) }}
                </p>
              </div>
              <UCheckbox
                  :id="`notify-${option.key}`"
                  v-model="formData[option.key]"
                  :disabled="isLoading"
                  class="max-xl:self-start"
              />
            </div>
          </div>
          <p class="text-xs text-muted pl-4 max-xl:pl-2">
            {{ $t('account.notifications.securityNote') }}
          </p>
        </div>

        <div class="flex justify-center pt-6 max-xl:pt-4">
          <UButton
              type="submit"
              color="primary"
              size="lg"
              class="max-xl:w-full"
              :loading="isSaving"
              :disabled="isLoading"
          >
            {{ $t('account.notifications.save') }}
          </UButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NotificationSettings } from '~/composables/useProfile'

const { t, locale } = useI18n()
const route = useRoute()
const siteConfig = useSiteConfig()

definePageMeta({
  middleware: 'auth'
})

const currentUrl = `${siteConfig.url}${route.path}`

useSeoMeta({
  title: () => t('account.notifications.title'),
  description: () => t('account.notifications.title'),
  ogTitle: () => t('account.notifications.title'),
  ogDescription: () => t('account.notifications.title'),
  ogImage: `${siteConfig.url}${siteConfig.logo}`,
  ogUrl: currentUrl,
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: () => t('account.notifications.title'),
  twitterDescription: () => t('account.notifications.title'),
  twitterImage: `${siteConfig.url}${siteConfig.logo}`,
  robots: 'noindex, nofollow'
})

useHead({
  link: [
    { rel: 'canonical', href: currentUrl }
  ]
})

const toast = useToast()
const { getNotificationSettings, updateNotificationSettings } = useProfile()

const options: Array<{ key: keyof NotificationSettings; label: string; description: string }> = [
  { key: 'messages', label: 'account.notifications.newMessages', description: 'account.notifications.newMessagesDesc' },
  { key: 'bookings', label: 'account.notifications.bookingUpdates', description: 'account.notifications.bookingUpdatesDesc' },
  { key: 'reviews', label: 'account.notifications.newReviews', description: 'account.notifications.newReviewsDesc' },
  { key: 'marketing', label: 'account.notifications.marketing', description: 'account.notifications.marketingDesc' }
]

const formData = ref<NotificationSettings>({
  messages: true,
  bookings: true,
  reviews: true,
  marketing: false
})

const isLoading = ref(true)
const isSaving = ref(false)

onMounted(async () => {
  try {
    formData.value = await getNotificationSettings()
  } catch (error: any) {
    toast.add({ title: error?.message || t('account.notifications.loadError'), color: 'error' })
  } finally {
    isLoading.value = false
  }
})

const handleSave = async () => {
  isSaving.value = true
  try {
    formData.value = await updateNotificationSettings(formData.value)
    toast.add({ title: t('account.notifications.saved'), color: 'success' })
  } catch (error: any) {
    toast.add({ title: error?.message || t('account.notifications.saveError'), color: 'error' })
  } finally {
    isSaving.value = false
  }
}
</script>

