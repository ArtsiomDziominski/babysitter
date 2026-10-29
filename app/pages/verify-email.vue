<script setup lang="ts">
import { UserRole } from '~/const/roles'

const { t } = useI18n()
const toast = useToast()
const authStore = useAuthStore()
const router = useRouter()
const localePath = useLocalePath()
const route = useRoute()

useSeoMeta({
  title: () => t('auth.verifyEmail.title'),
  robots: 'noindex, nofollow'
})

const RESEND_COOLDOWN_SECONDS = 60

const email = computed(() => (typeof route.query.email === 'string' ? route.query.email : ''))
const code = ref<string[]>([])
const isLoading = ref(false)
const isResending = ref(false)
const cooldown = ref(RESEND_COOLDOWN_SECONDS)
let timer: ReturnType<typeof setInterval> | undefined

function startCooldown() {
  cooldown.value = RESEND_COOLDOWN_SECONDS
  clearInterval(timer)
  timer = setInterval(() => {
    cooldown.value -= 1
    if (cooldown.value <= 0) clearInterval(timer)
  }, 1000)
}

onMounted(() => {
  if (!email.value) {
    router.replace(localePath('/register'))
    return
  }
  startCooldown()
})
onBeforeUnmount(() => clearInterval(timer))

async function onSubmit() {
  const value = code.value.join('')
  if (value.length !== 6 || isLoading.value) return

  isLoading.value = true
  try {
    await authStore.verifyEmail(email.value, value)
    toast.add({ title: t('auth.verifyEmail.success'), color: 'success' })
    const role = authStore.user.role
    const target = role ? (role === UserRole.PARENT ? '/search' : '/account/profile') : '/choose-role'
    await router.push(localePath(target))
  } catch (error: any) {
    code.value = []
    toast.add({ title: error?.message || t('auth.verifyEmail.error'), color: 'error' })
  } finally {
    isLoading.value = false
  }
}

async function onResend() {
  if (cooldown.value > 0 || isResending.value) return
  isResending.value = true
  try {
    await authStore.resendEmailVerification(email.value)
    toast.add({ title: t('auth.verifyEmail.codeSent'), color: 'success' })
    startCooldown()
  } catch (error: any) {
    toast.add({ title: error?.message || t('auth.verifyEmail.error'), color: 'error' })
  } finally {
    isResending.value = false
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[calc(100vh-var(--ui-header-height))] py-10">
    <UPageCard variant="outline" class="w-full max-w-md bg-default" :ui="{ container: 'sm:p-8' }">
      <div class="flex flex-col items-center text-center gap-4">
        <UIcon name="i-lucide-mail-check" class="size-8 text-primary" />
        <div class="space-y-1">
          <h1 class="text-xl font-semibold text-highlighted">
            {{ t('auth.verifyEmail.title') }}
          </h1>
          <p class="text-sm text-muted">
            {{ t('auth.verifyEmail.description') }}
            <span class="block font-medium text-default [overflow-wrap:anywhere]">{{ email }}</span>
          </p>
        </div>

        <form class="flex flex-col items-center gap-4 w-full" @submit.prevent="onSubmit">
          <UPinInput
            v-model="code"
            :length="6"
            type="number"
            otp
            size="xl"
            autofocus
            :disabled="isLoading"
            @complete="onSubmit"
          />
          <UButton type="submit" block :loading="isLoading" :disabled="code.join('').length !== 6">
            {{ t('auth.verifyEmail.submit') }}
          </UButton>
        </form>

        <div class="text-sm text-muted space-y-2">
          <p>{{ t('auth.verifyEmail.checkSpam') }}</p>
          <UButton
            variant="link"
            :disabled="cooldown > 0"
            :loading="isResending"
            @click="onResend"
          >
            {{ cooldown > 0 ? t('auth.verifyEmail.resendIn', { seconds: cooldown }) : t('auth.verifyEmail.resend') }}
          </UButton>
          <div>
            <ULink :to="localePath('/register')" class="font-medium">
              {{ t('auth.verifyEmail.wrongEmail') }}
            </ULink>
          </div>
        </div>
      </div>
    </UPageCard>
  </div>
</template>
