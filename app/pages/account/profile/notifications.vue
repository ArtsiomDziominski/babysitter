<template>
  <div class="flex-1">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 max-xl:p-4">
      <h1 class="text-2xl max-xl:text-xl font-bold text-gray-900 dark:text-white mb-8 max-xl:mb-4">
        {{ $t('account.notifications.title') }}
      </h1>

      <form @submit.prevent="handleSave" class="space-y-8 max-xl:space-y-6">
        <!-- Email уведомления -->
        <div class="space-y-4 max-xl:space-y-3">
          <h2 class="text-lg max-xl:text-base font-semibold text-gray-900 dark:text-white">
            {{ $t('account.notifications.emailNotifications') }}
          </h2>
          <div class="space-y-4 max-xl:space-y-3 pl-4 max-xl:pl-2">
            <div class="flex items-center justify-between max-xl:flex-col max-xl:items-stretch max-xl:gap-2">
              <div class="flex-1 max-xl:w-full">
                <label class="text-sm max-xl:text-xs font-medium text-gray-700 dark:text-gray-300">
                  {{ $t('account.notifications.newMessages') }}
                </label>
                <p class="text-xs max-xl:text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                  {{ $t('account.notifications.newMessagesDesc') }}
                </p>
              </div>
              <UCheckbox
                  v-model="formData.emailNewMessages"
                  class="max-xl:self-start"
              />
            </div>

            <div class="flex items-center justify-between max-xl:flex-col max-xl:items-stretch max-xl:gap-2">
              <div class="flex-1 max-xl:w-full">
                <label class="text-sm max-xl:text-xs font-medium text-gray-700 dark:text-gray-300">
                  {{ $t('account.notifications.bookingUpdates') }}
                </label>
                <p class="text-xs max-xl:text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                  {{ $t('account.notifications.bookingUpdatesDesc') }}
                </p>
              </div>
              <UCheckbox
                  v-model="formData.emailBookingUpdates"
                  class="max-xl:self-start"
              />
            </div>

            <div class="flex items-center justify-between max-xl:flex-col max-xl:items-stretch max-xl:gap-2">
              <div class="flex-1 max-xl:w-full">
                <label class="text-sm max-xl:text-xs font-medium text-gray-700 dark:text-gray-300">
                  {{ $t('account.notifications.newReviews') }}
                </label>
                <p class="text-xs max-xl:text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                  {{ $t('account.notifications.newReviewsDesc') }}
                </p>
              </div>
              <UCheckbox
                  v-model="formData.emailNewReviews"
                  class="max-xl:self-start"
              />
            </div>

            <div class="flex items-center justify-between max-xl:flex-col max-xl:items-stretch max-xl:gap-2">
              <div class="flex-1 max-xl:w-full">
                <label class="text-sm max-xl:text-xs font-medium text-gray-700 dark:text-gray-300">
                  {{ $t('account.notifications.reminders') }}
                </label>
                <p class="text-xs max-xl:text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                  {{ $t('account.notifications.remindersDesc') }}
                </p>
              </div>
              <UCheckbox
                  v-model="formData.emailReminders"
                  class="max-xl:self-start"
              />
            </div>
          </div>
        </div>

        <!-- Push уведомления -->
        <div class="space-y-4 max-xl:space-y-3">
          <h2 class="text-lg max-xl:text-base font-semibold text-gray-900 dark:text-white">
            {{ $t('account.notifications.pushNotifications') }}
          </h2>
          <div class="space-y-4 max-xl:space-y-3 pl-4 max-xl:pl-2">
            <div class="flex items-center justify-between max-xl:flex-col max-xl:items-stretch max-xl:gap-2">
              <div class="flex-1 max-xl:w-full">
                <label class="text-sm max-xl:text-xs font-medium text-gray-700 dark:text-gray-300">
                  {{ $t('account.notifications.newMessages') }}
                </label>
                <p class="text-xs max-xl:text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                  {{ $t('account.notifications.newMessagesDesc') }}
                </p>
              </div>
              <UCheckbox
                  v-model="formData.pushNewMessages"
                  class="max-xl:self-start"
              />
            </div>

            <div class="flex items-center justify-between max-xl:flex-col max-xl:items-stretch max-xl:gap-2">
              <div class="flex-1 max-xl:w-full">
                <label class="text-sm max-xl:text-xs font-medium text-gray-700 dark:text-gray-300">
                  {{ $t('account.notifications.bookingUpdates') }}
                </label>
                <p class="text-xs max-xl:text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                  {{ $t('account.notifications.bookingUpdatesDesc') }}
                </p>
              </div>
              <UCheckbox
                  v-model="formData.pushBookingUpdates"
                  class="max-xl:self-start"
              />
            </div>

            <div class="flex items-center justify-between max-xl:flex-col max-xl:items-stretch max-xl:gap-2">
              <div class="flex-1 max-xl:w-full">
                <label class="text-sm max-xl:text-xs font-medium text-gray-700 dark:text-gray-300">
                  {{ $t('account.notifications.reminders') }}
                </label>
                <p class="text-xs max-xl:text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                  {{ $t('account.notifications.remindersDesc') }}
                </p>
              </div>
              <UCheckbox
                  v-model="formData.pushReminders"
                  class="max-xl:self-start"
              />
            </div>
          </div>
        </div>

        <!-- SMS уведомления -->
        <div class="space-y-4 max-xl:space-y-3">
          <h2 class="text-lg max-xl:text-base font-semibold text-gray-900 dark:text-white">
            {{ $t('account.notifications.smsNotifications') }}
          </h2>
          <div class="space-y-4 max-xl:space-y-3 pl-4 max-xl:pl-2">
            <div class="flex items-center justify-between max-xl:flex-col max-xl:items-stretch max-xl:gap-2">
              <div class="flex-1 max-xl:w-full">
                <label class="text-sm max-xl:text-xs font-medium text-gray-700 dark:text-gray-300">
                  {{ $t('account.notifications.bookingConfirmations') }}
                </label>
                <p class="text-xs max-xl:text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                  {{ $t('account.notifications.bookingConfirmationsDesc') }}
                </p>
              </div>
              <UCheckbox
                  v-model="formData.smsBookingConfirmations"
                  class="max-xl:self-start"
              />
            </div>

            <div class="flex items-center justify-between max-xl:flex-col max-xl:items-stretch max-xl:gap-2">
              <div class="flex-1 max-xl:w-full">
                <label class="text-sm max-xl:text-xs font-medium text-gray-700 dark:text-gray-300">
                  {{ $t('account.notifications.importantUpdates') }}
                </label>
                <p class="text-xs max-xl:text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                  {{ $t('account.notifications.importantUpdatesDesc') }}
                </p>
              </div>
              <UCheckbox
                  v-model="formData.smsImportantUpdates"
                  class="max-xl:self-start"
              />
            </div>
          </div>
        </div>

        <!-- Другие настройки -->
        <div class="space-y-4 max-xl:space-y-3">
          <h2 class="text-lg max-xl:text-base font-semibold text-gray-900 dark:text-white">
            {{ $t('account.notifications.otherSettings') }}
          </h2>
          <div class="space-y-4 max-xl:space-y-3 pl-4 max-xl:pl-2">
            <div class="flex items-center justify-between max-xl:flex-col max-xl:items-stretch max-xl:gap-2">
              <div class="flex-1 max-xl:w-full">
                <label class="text-sm max-xl:text-xs font-medium text-gray-700 dark:text-gray-300">
                  {{ $t('account.notifications.marketing') }}
                </label>
                <p class="text-xs max-xl:text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                  {{ $t('account.notifications.marketingDesc') }}
                </p>
              </div>
              <UCheckbox
                  v-model="formData.marketing"
                  class="max-xl:self-start"
              />
            </div>
          </div>
        </div>

        <div class="flex justify-center pt-6 max-xl:pt-4">
          <UButton
              type="submit"
              color="primary"
              size="lg"
              class="max-xl:w-full"
              :loading="isSaving"
          >
            {{ $t('account.notifications.save') }}
          </UButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
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
  ogLocale: locale.value,
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

const formData = ref({
  emailNewMessages: true,
  emailBookingUpdates: true,
  emailNewReviews: true,
  emailReminders: true,
  pushNewMessages: true,
  pushBookingUpdates: true,
  pushReminders: true,
  smsBookingConfirmations: false,
  smsImportantUpdates: false,
  marketing: false
})

const isSaving = ref(false)

const handleSave = async () => {
  isSaving.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
  } finally {
    isSaving.value = false
  }
}
</script>

