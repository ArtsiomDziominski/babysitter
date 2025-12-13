<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-8">
      {{ $t('account.notifications.title') }}
    </h1>

    <form @submit.prevent="handleSave" class="space-y-8">
      <!-- Email уведомления -->
      <div class="space-y-4">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ $t('account.notifications.emailNotifications') }}
        </h2>
        <div class="space-y-4 pl-4">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ $t('account.notifications.newMessages') }}
              </label>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {{ $t('account.notifications.newMessagesDesc') }}
              </p>
            </div>
            <UCheckbox
              v-model="formData.emailNewMessages"
            />
          </div>

          <div class="flex items-center justify-between">
            <div class="flex-1">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ $t('account.notifications.bookingUpdates') }}
              </label>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {{ $t('account.notifications.bookingUpdatesDesc') }}
              </p>
            </div>
            <UCheckbox
              v-model="formData.emailBookingUpdates"
            />
          </div>

          <div class="flex items-center justify-between">
            <div class="flex-1">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ $t('account.notifications.newReviews') }}
              </label>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {{ $t('account.notifications.newReviewsDesc') }}
              </p>
            </div>
            <UCheckbox
              v-model="formData.emailNewReviews"
            />
          </div>

          <div class="flex items-center justify-between">
            <div class="flex-1">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ $t('account.notifications.reminders') }}
              </label>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {{ $t('account.notifications.remindersDesc') }}
              </p>
            </div>
            <UCheckbox
              v-model="formData.emailReminders"
            />
          </div>
        </div>
      </div>

      <!-- Push уведомления -->
      <div class="space-y-4">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ $t('account.notifications.pushNotifications') }}
        </h2>
        <div class="space-y-4 pl-4">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ $t('account.notifications.newMessages') }}
              </label>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {{ $t('account.notifications.newMessagesDesc') }}
              </p>
            </div>
            <UCheckbox
              v-model="formData.pushNewMessages"
            />
          </div>

          <div class="flex items-center justify-between">
            <div class="flex-1">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ $t('account.notifications.bookingUpdates') }}
              </label>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {{ $t('account.notifications.bookingUpdatesDesc') }}
              </p>
            </div>
            <UCheckbox
              v-model="formData.pushBookingUpdates"
            />
          </div>

          <div class="flex items-center justify-between">
            <div class="flex-1">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ $t('account.notifications.reminders') }}
              </label>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {{ $t('account.notifications.remindersDesc') }}
              </p>
            </div>
            <UCheckbox
              v-model="formData.pushReminders"
            />
          </div>
        </div>
      </div>

      <!-- SMS уведомления -->
      <div class="space-y-4">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ $t('account.notifications.smsNotifications') }}
        </h2>
        <div class="space-y-4 pl-4">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ $t('account.notifications.bookingConfirmations') }}
              </label>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {{ $t('account.notifications.bookingConfirmationsDesc') }}
              </p>
            </div>
            <UCheckbox
              v-model="formData.smsBookingConfirmations"
            />
          </div>

          <div class="flex items-center justify-between">
            <div class="flex-1">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ $t('account.notifications.importantUpdates') }}
              </label>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {{ $t('account.notifications.importantUpdatesDesc') }}
              </p>
            </div>
            <UCheckbox
              v-model="formData.smsImportantUpdates"
            />
          </div>
        </div>
      </div>

      <!-- Другие настройки -->
      <div class="space-y-4">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ $t('account.notifications.otherSettings') }}
        </h2>
        <div class="space-y-4 pl-4">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ $t('account.notifications.marketing') }}
              </label>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {{ $t('account.notifications.marketingDesc') }}
              </p>
            </div>
            <UCheckbox
              v-model="formData.marketing"
            />
          </div>
        </div>
      </div>

      <div class="flex justify-center pt-6">
        <UButton
          type="submit"
          color="primary"
          size="lg"
          :loading="isSaving"
        >
          {{ $t('account.notifications.save') }}
        </UButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

definePageMeta({
  middleware: 'auth'
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

