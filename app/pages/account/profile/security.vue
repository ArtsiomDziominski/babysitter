<template>
  <div class="flex gap-6">
    <ProfileSidebar />

    <!-- Основной контент -->
    <div class="flex-1">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-8">
      {{ $t('account.security.title') }}
    </h1>

    <div class="space-y-8">
      <!-- Изменение почтового адреса -->
      <div class="border-b border-gray-200 dark:border-gray-700 pb-8">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          {{ $t('account.security.changeEmail') }}
        </h2>

        <form @submit.prevent="handleEmailChange" class="space-y-4 max-w-md">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('account.security.currentEmail') }}
            </label>
            <p class="text-gray-900 dark:text-white text-base">
              {{ authStore.currentUser?.email }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('account.security.newEmail') }}
            </label>
            <UInput
                v-model="emailForm.newEmail"
                type="email"
                :placeholder="$t('auth.emailPlaceholder')"
                size="lg"
            />
          </div>

          <div v-if="showVerificationCode">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('account.security.verificationCode') }}
            </label>
            <UInput
                v-model="emailForm.verificationCode"
                type="text"
                :placeholder="$t('account.security.verificationCodePlaceholder')"
                size="lg"
            />
            <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {{ $t('account.security.verificationCodeHint') }}
            </p>
          </div>

          <div class="flex gap-3">
            <UButton
                v-if="!showVerificationCode"
                type="submit"
                color="primary"
                size="lg"
                :loading="isChangingEmail"
            >
              {{ $t('account.security.saveEmail') }}
            </UButton>
            <UButton
                v-else
                type="button"
                color="primary"
                size="lg"
                :loading="isVerifyingCode"
                @click="handleVerifyCode"
            >
              {{ $t('account.security.verifyCode') }}
            </UButton>
            <UButton
                v-if="showVerificationCode"
                type="button"
                variant="outline"
                size="lg"
                @click="cancelEmailChange"
            >
              {{ $t('account.security.cancel') }}
            </UButton>
          </div>
        </form>
      </div>

      <!-- Изменение пароля -->
      <div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          {{ $t('account.security.changePassword') }}
        </h2>

        <form @submit.prevent="handlePasswordChange" class="space-y-4 max-w-md">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('account.security.currentPassword') }}
            </label>
            <UInput
                v-model="passwordForm.currentPassword"
                type="password"
                :placeholder="$t('account.security.currentPasswordPlaceholder')"
                size="lg"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('account.security.newPassword') }}
            </label>
            <UInput
                v-model="passwordForm.newPassword"
                type="password"
                :placeholder="$t('account.security.newPasswordPlaceholder')"
                size="lg"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('auth.confirmPassword') }}
            </label>
            <UInput
                v-model="passwordForm.confirmPassword"
                type="password"
                :placeholder="$t('auth.confirmPasswordPlaceholder')"
                size="lg"
            />
          </div>

          <UButton
              type="submit"
              color="primary"
              size="lg"
              :loading="isChangingPassword"
          >
            {{ $t('account.security.savePassword') }}
          </UButton>
        </form>
      </div>
    </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const authStore = useAuthStore()

definePageMeta({
  middleware: 'auth'
})

const emailForm = ref({
  newEmail: '',
  verificationCode: ''
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const isChangingEmail = ref(false)
const isChangingPassword = ref(false)
const isVerifyingCode = ref(false)
const showVerificationCode = ref(false)

const handleEmailChange = async () => {
  if (!emailForm.value.newEmail) {
    return
  }

  isChangingEmail.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    showVerificationCode.value = true
  } finally {
    isChangingEmail.value = false
  }
}

const handleVerifyCode = async () => {
  if (!emailForm.value.verificationCode) {
    return
  }

  isVerifyingCode.value = true
  try {
    authStore.setUser({
      ...authStore.currentUser!,
      email: emailForm.value.newEmail
    })
    await new Promise(resolve => setTimeout(resolve, 500))
    showVerificationCode.value = false
    emailForm.value.newEmail = ''
    emailForm.value.verificationCode = ''
  } finally {
    isVerifyingCode.value = false
  }
}

const cancelEmailChange = () => {
  showVerificationCode.value = false
  emailForm.value.newEmail = ''
  emailForm.value.verificationCode = ''
}

const handlePasswordChange = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    return
  }

  isChangingPassword.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    passwordForm.value.currentPassword = ''
    passwordForm.value.newPassword = ''
    passwordForm.value.confirmPassword = ''
  } finally {
    isChangingPassword.value = false
  }
}
</script>

