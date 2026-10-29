<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'
import { UserRole } from '~/const/roles'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const toast = useToast()
const route = useRoute()
const siteConfig = useSiteConfig()

const currentUrl = `${siteConfig.url}${route.path}`

useSeoMeta({
  title: () => t('seo.forgotPassword.title'),
  description: () => t('seo.forgotPassword.description'),
  robots: 'noindex, nofollow',
  ogTitle: () => t('seo.forgotPassword.title'),
  ogDescription: () => t('seo.forgotPassword.description'),
  ogImage: `${siteConfig.url}${siteConfig.logo}`,
  ogUrl: currentUrl,
  ogType: 'website'
})

useHead({
  link: [
    { rel: 'canonical', href: currentUrl }
  ]
})

const fields: AuthFormField[] = [
  {
    name: 'email',
    type: 'email',
    label: t('auth.email'),
    placeholder: t('auth.emailPlaceholder'),
    required: true
  }
]

const { email: emailRule, password, requiredString, focusFirstError } = useFormValidation()

const schema = z.object({
  email: emailRule()
})

type Schema = z.output<typeof schema>

const authStore = useAuthStore()
const router = useRouter()

const RESEND_COOLDOWN_SECONDS = 60

const step = ref<'email' | 'code'>('email')
const email = ref('')
const isLoading = ref(false)
const cooldown = ref(0)
let timer: ReturnType<typeof setInterval> | undefined

const resetSchema = z.object({
  code: z.string().regex(/^\d{6}$/, { error: () => t('auth.passwordReset.codeInvalid') }),
  password: password(),
  confirmPassword: requiredString({ trim: false })
}).refine(data => data.password === data.confirmPassword, {
  error: () => t('auth.passwordsDoNotMatch'),
  path: ['confirmPassword'],
  when: payload => typeof payload.value === 'object' && payload.value !== null
    && 'password' in payload.value && 'confirmPassword' in payload.value
})

const resetState = reactive({ code: '', password: '', confirmPassword: '' })
const codeDigits = ref<string[]>([])
watch(codeDigits, (value) => { resetState.code = value.join('') })

function startCooldown() {
  cooldown.value = RESEND_COOLDOWN_SECONDS
  clearInterval(timer)
  timer = setInterval(() => {
    cooldown.value -= 1
    if (cooldown.value <= 0) clearInterval(timer)
  }, 1000)
}
onBeforeUnmount(() => clearInterval(timer))

async function sendCode(target: string) {
  await authStore.requestPasswordReset(target)
  startCooldown()
  toast.add({ title: t('auth.resetPasswordSuccess'), description: t('auth.passwordReset.codeSent'), color: 'success' })
}

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  isLoading.value = true
  try {
    email.value = payload.data.email
    await sendCode(email.value)
    step.value = 'code'
  } catch (error: any) {
    toast.add({ title: error?.message || t('auth.passwordReset.error'), color: 'error' })
  } finally {
    isLoading.value = false
  }
}

async function onResend() {
  if (cooldown.value > 0 || isLoading.value) return
  try {
    await sendCode(email.value)
  } catch (error: any) {
    toast.add({ title: error?.message || t('auth.passwordReset.error'), color: 'error' })
  }
}

async function onReset() {
  isLoading.value = true
  try {
    const response = await authStore.resetPassword(email.value, resetState.code, resetState.password)
    toast.add({ title: t('auth.passwordReset.success'), color: 'success' })
    if (!response.access_token) {
      // Аккаунт с 2FA: пароль сменён, но войти нужно отдельно
      await router.push(localePath('/login'))
      return
    }
    const role = authStore.user.role
    const target = role ? (role === UserRole.PARENT ? '/search' : '/account/profile') : '/choose-role'
    await router.push(localePath(target))
  } catch (error: any) {
    codeDigits.value = []
    toast.add({ title: error?.message || t('auth.passwordReset.error'), color: 'error' })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[calc(100vh-var(--ui-header-height))] py-10">
    <UPageCard variant="outline" class="w-full max-w-md bg-default" :ui="{ container: 'sm:p-8' }">
      <UAuthForm
        v-if="step === 'email'"
        :schema="schema"
        :title="t('auth.resetPassword')"
        :description="t('auth.resetPasswordDescription')"
        icon="i-lucide-key"
        :fields="fields"
        :submit="{ label: t('auth.passwordReset.sendCode'), block: true }"
        :loading="isLoading"
        @submit="onSubmit"
        @error="focusFirstError"
      >
        <template #footer>
          <div class="text-center text-sm text-muted mt-4 space-y-2">
            <div>
              {{ t('auth.rememberPassword') }}
              <ULink :to="localePath('/login')" class="font-medium">
                {{ t('auth.login') }}
              </ULink>
            </div>
          </div>
        </template>
      </UAuthForm>

      <div v-else class="flex flex-col gap-4">
        <div class="flex flex-col items-center text-center gap-2">
          <UIcon name="i-lucide-key" class="size-8 text-primary" />
          <h1 class="text-xl font-semibold text-highlighted">
            {{ t('auth.passwordReset.newPasswordTitle') }}
          </h1>
          <p class="text-sm text-muted">
            {{ t('auth.passwordReset.codeDescription') }}
            <span class="block font-medium text-default [overflow-wrap:anywhere]">{{ email }}</span>
          </p>
        </div>

        <UForm :schema="resetSchema" :state="resetState" class="flex flex-col gap-4" @submit="onReset" @error="focusFirstError">
          <UFormField name="code" :label="t('auth.passwordReset.code')" class="flex flex-col items-center">
            <UPinInput v-model="codeDigits" :length="6" type="number" otp size="lg" autofocus />
          </UFormField>
          <UFormField name="password" :label="t('auth.passwordReset.newPassword')">
            <UInput v-model="resetState.password" type="password" autocomplete="new-password" class="w-full" />
          </UFormField>
          <UFormField name="confirmPassword" :label="t('auth.confirmPassword')">
            <UInput v-model="resetState.confirmPassword" type="password" autocomplete="new-password" class="w-full" />
          </UFormField>
          <UButton type="submit" block :loading="isLoading">
            {{ t('auth.passwordReset.submit') }}
          </UButton>
        </UForm>

        <div class="text-center text-sm text-muted space-y-2">
          <p>{{ t('auth.verifyEmail.checkSpam') }}</p>
          <UButton variant="link" :disabled="cooldown > 0" @click="onResend">
            {{ cooldown > 0 ? t('auth.verifyEmail.resendIn', { seconds: cooldown }) : t('auth.verifyEmail.resend') }}
          </UButton>
          <div>
            <ULink class="font-medium cursor-pointer" @click="step = 'email'">
              {{ t('auth.passwordReset.changeEmail') }}
            </ULink>
          </div>
        </div>
      </div>
    </UPageCard>
  </div>
</template>

