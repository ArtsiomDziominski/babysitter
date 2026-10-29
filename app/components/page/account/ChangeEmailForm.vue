<template>
  <div class="border-b border-default pb-8 max-xl:pb-4">
    <h2 class="text-xl max-xl:text-lg font-semibold text-highlighted mb-6 max-xl:mb-4">
      {{ $t('account.security.changeEmail') }}
    </h2>

    <form @submit.prevent="handleEmailChange" class="space-y-4 max-w-md max-xl:max-w-full">
      <div>
        <label class="block text-sm font-medium text-default mb-2">
          {{ $t('account.security.currentEmail') }}
        </label>
        <p class="text-highlighted text-base">
          {{ authStore.currentUser?.email }}
        </p>
      </div>

      <div>
        <label class="block text-sm font-medium text-default mb-2">
          {{ $t('account.security.newEmail') }}
        </label>
        <UInput
            v-model="emailForm.newEmail"
            type="email"
            :placeholder="$t('auth.emailPlaceholder')"
            size="lg"
        />
      </div>

      <div v-if="!showVerificationCode">
        <label class="block text-sm font-medium text-default mb-2">
          {{ $t('account.security.currentPassword') }}
        </label>
        <UInput
            v-model="emailForm.currentPassword"
            type="password"
            autocomplete="current-password"
            :placeholder="$t('account.security.currentPasswordPlaceholder')"
            size="lg"
        />
      </div>

      <div v-if="showVerificationCode">
        <label class="block text-sm font-medium text-default mb-2">
          {{ $t('account.security.verificationCode') }}
        </label>
        <UInput
            v-model="emailForm.verificationCode"
            type="text"
            :placeholder="$t('account.security.verificationCodePlaceholder')"
            size="lg"
        />
        <p class="mt-2 text-xs text-muted">
          {{ $t('account.security.verificationCodeHint') }}
        </p>
      </div>

      <div class="flex gap-3 max-xl:flex-col">
        <UButton
            v-if="!showVerificationCode"
            type="submit"
            color="primary"
            size="lg"
            class="max-xl:w-full"
            :loading="isChangingEmail"
        >
          {{ $t('account.security.saveEmail') }}
        </UButton>
        <UButton
            v-else
            type="button"
            color="primary"
            size="lg"
            class="max-xl:w-full"
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
            class="max-xl:w-full"
            @click="cancelEmailChange"
        >
          {{ $t('account.security.cancel') }}
        </UButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const authStore = useAuthStore()
const security = useSecurity()
const toast = useToast()

const emailForm = ref({
  newEmail: '',
  currentPassword: '',
  verificationCode: ''
})

const isChangingEmail = ref(false)
const isVerifyingCode = ref(false)
const showVerificationCode = ref(false)

const handleEmailChange = async () => {
  if (!emailForm.value.newEmail || !emailForm.value.currentPassword) {
    return
  }

  isChangingEmail.value = true
  try {
    await security.requestEmailChange({
      newEmail: emailForm.value.newEmail,
      currentPassword: emailForm.value.currentPassword
    })
    toast.add({
      title: t('account.security.emailCodeSent'),
      description: t('account.security.emailCodeSentDescription'),
      color: 'success'
    })
    showVerificationCode.value = true
    emailForm.value.currentPassword = ''
  } catch (error: any) {
    toast.add({
      title: t('account.security.emailError'),
      description: error.message || t('account.security.requestEmailError'),
      color: 'error'
    })
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
    await security.confirmEmailChange({
      code: emailForm.value.verificationCode,
      newEmail: emailForm.value.newEmail
    })
    authStore.setUser({
      ...authStore.currentUser!,
      email: emailForm.value.newEmail
    })
    toast.add({
      title: t('account.security.emailSuccess'),
      description: t('account.security.emailChanged'),
      color: 'success'
    })
    showVerificationCode.value = false
    emailForm.value.newEmail = ''
    emailForm.value.verificationCode = ''
  } catch (error: any) {
    toast.add({
      title: t('account.security.emailError'),
      description: error.message || t('account.security.confirmEmailError'),
      color: 'error'
    })
  } finally {
    isVerifyingCode.value = false
  }
}

const cancelEmailChange = () => {
  showVerificationCode.value = false
  emailForm.value.newEmail = ''
  emailForm.value.currentPassword = ''
  emailForm.value.verificationCode = ''
}
</script>

