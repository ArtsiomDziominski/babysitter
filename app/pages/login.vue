<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'
import { UserRole } from '~/const/roles'

const { t, locale } = useI18n()
const toast = useToast()
const authStore = useAuthStore()
const router = useRouter()
const localePath = useLocalePath()
const route = useRoute()
const siteConfig = useSiteConfig()

const currentUrl = `${siteConfig.url}${route.path}`

useSeoMeta({
  title: () => t('seo.login.title'),
  description: () => t('seo.login.description'),
  robots: 'noindex, nofollow',
  ogTitle: () => t('seo.login.title'),
  ogDescription: () => t('seo.login.description'),
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
  },
  {
    name: 'password',
    label: t('auth.password'),
    type: 'password',
    placeholder: t('auth.passwordPlaceholder'),
    required: true
  },
  {
    name: 'remember',
    label: t('auth.rememberMe'),
    type: 'checkbox'
  }
]

const schema = z.object({
  email: z.string().email(t('auth.invalidEmail')),
  password: z.string().min(8, t('auth.passwordMinLength'))
})

type Schema = z.output<typeof schema>

const isLoading = ref(false)

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  isLoading.value = true
  try {
    const response = await authStore.login(payload.data.email, payload.data.password)
    if (response.requiresEmailVerification) {
      toast.add({ title: t('auth.verifyEmail.notVerified'), color: 'warning' })
      await router.push(localePath({ path: '/verify-email', query: { email: response.email ?? payload.data.email } }))
      return
    }
    const role = authStore.user.role
    // Возврат на страницу, откуда отправили логиниться (например, сердечко «Избранное»)
    const redirect = typeof route.query.redirect === 'string' && route.query.redirect.startsWith('/') && !route.query.redirect.startsWith('//')
      ? route.query.redirect
      : null
    if (role && redirect) {
      toast.add({ title: t('auth.loginSuccess'), color: 'success' })
      await router.push(redirect)
      return
    }
    const target = role ? (role === UserRole.PARENT ? '/search' : '/account/profile') : '/choose-role'
    toast.add({ 
      title: t('auth.loginSuccess'), 
      color: 'success' 
    })
    await router.push(localePath(target))
  } catch (error: any) {
    const errorMessage = error?.message || error?.details?.[0]?.message || t('auth.loginError')
    toast.add({ 
      title: errorMessage, 
      color: 'error' 
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[calc(100vh-var(--ui-header-height))] py-10">
    <UPageCard variant="outline" class="w-full max-w-md bg-default" :ui="{ container: 'sm:p-8' }">
      <UAuthForm
        :schema="schema"
        :title="t('auth.login')"
        :description="t('auth.loginDescription')"
        icon="i-lucide-user"
        :fields="fields"
        :submit="{ label: t('auth.login'), block: true }"
        :loading="isLoading"
        @submit="onSubmit"
      >
        <template #footer>
          <div class="text-center text-sm text-muted mt-4 space-y-2">
            <div>
              {{ t('auth.noAccount') }}
              <ULink :to="localePath('/register')" class="font-medium">
                {{ t('auth.register') }}
              </ULink>
            </div>
            <div>
              <ULink :to="localePath('/forgot-password')" class="font-medium">
                {{ t('auth.forgotPassword') }}
              </ULink>
            </div>
          </div>
        </template>
      </UAuthForm>
    </UPageCard>
  </div>
</template>

