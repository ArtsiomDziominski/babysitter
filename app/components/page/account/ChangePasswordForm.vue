<template>
  <div>
    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
      {{ $t('account.security.changePassword') }}
    </h2>

    <form @submit.prevent="handlePasswordChange" class="space-y-4 max-w-md">
      <div v-if="!showPasswordVerificationCode">
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

      <div v-if="showPasswordVerificationCode">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ $t('account.security.verificationCode') }}
        </label>
        <UInput
            v-model="passwordForm.verificationCode"
            type="text"
            :placeholder="$t('account.security.verificationCodePlaceholder')"
            size="lg"
        />
        <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {{ $t('account.security.passwordVerificationCodeHint') }}
        </p>
      </div>

      <div class="flex gap-3">
        <UButton
            v-if="!showPasswordVerificationCode"
            type="submit"
            color="primary"
            size="lg"
            :loading="isRequestingPasswordCode"
        >
          {{ $t('account.security.requestPasswordChange') }}
        </UButton>
        <UButton
            v-else
            type="button"
            color="primary"
            size="lg"
            :loading="isChangingPassword"
            @click="handleConfirmPasswordChange"
        >
          {{ $t('account.security.savePassword') }}
        </UButton>
        <UButton
            v-if="showPasswordVerificationCode"
            type="button"
            variant="outline"
            size="lg"
            @click="cancelPasswordChange"
        >
          {{ $t('account.security.cancel') }}
        </UButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const security = useSecurity()
const toast = useToast()

const passwordForm = ref({
  newPassword: '',
  verificationCode: ''
})

const isChangingPassword = ref(false)
const isRequestingPasswordCode = ref(false)
const showPasswordVerificationCode = ref(false)

const handlePasswordChange = async () => {
  if (!passwordForm.value.newPassword) {
    return
  }

  if (passwordForm.value.newPassword.length < 8) {
    toast.add({
      title: t('account.security.passwordError'),
      description: t('auth.passwordMinLength'),
      color: 'error'
    })
    return
  }

  isRequestingPasswordCode.value = true
  try {
    await security.requestPasswordChange()
    toast.add({
      title: t('account.security.passwordCodeSent'),
      description: t('account.security.passwordCodeSentDescription'),
      color: 'success'
    })
    showPasswordVerificationCode.value = true
  } catch (error: any) {
    toast.add({
      title: t('account.security.passwordError'),
      description: error.message || t('account.security.requestPasswordError'),
      color: 'error'
    })
  } finally {
    isRequestingPasswordCode.value = false
  }
}

const handleConfirmPasswordChange = async () => {
  if (!passwordForm.value.verificationCode || !passwordForm.value.newPassword) {
    return
  }

  if (passwordForm.value.newPassword.length < 8) {
    toast.add({
      title: t('account.security.passwordError'),
      description: t('auth.passwordMinLength'),
      color: 'error'
    })
    return
  }

  isChangingPassword.value = true
  try {
    await security.confirmPasswordChange({
      code: passwordForm.value.verificationCode,
      newPassword: passwordForm.value.newPassword
    })
    toast.add({
      title: t('account.security.passwordSuccess'),
      description: t('account.security.passwordChanged'),
      color: 'success'
    })
    showPasswordVerificationCode.value = false
    passwordForm.value.newPassword = ''
    passwordForm.value.verificationCode = ''
  } catch (error: any) {
    toast.add({
      title: t('account.security.passwordError'),
      description: error.message || t('account.security.confirmPasswordError'),
      color: 'error'
    })
  } finally {
    isChangingPassword.value = false
  }
}

const cancelPasswordChange = () => {
  showPasswordVerificationCode.value = false
  passwordForm.value.newPassword = ''
  passwordForm.value.verificationCode = ''
}
</script>

