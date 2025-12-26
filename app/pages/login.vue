<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'
import { UserRole } from '~/const/roles'

const { t, locale } = useI18n()
const toast = useToast()
const authStore = useAuthStore()
const router = useRouter()
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
  ogType: 'website',
  ogLocale: locale.value
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

const providers = [
  {
    label: 'Google',
    icon: 'i-simple-icons-google',
    onClick: () => {
      toast.add({ title: 'Google', description: t('auth.loginWithGoogle') })
    }
  },
  {
    label: 'Яндекс',
    icon: 'i-lucide-yandex',
    onClick: () => {
      toast.add({ title: 'Яндекс', description: t('auth.loginWithYandex') })
    }
  },
  {
    label: 'VK',
    icon: 'i-simple-icons-vk',
    onClick: () => {
      toast.add({ title: 'VK', description: t('auth.loginWithVK') })
    }
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
    await authStore.login(payload.data.email, payload.data.password)
    const role = authStore.user.role
    const target = role ? (role === UserRole.PARENT ? '/search' : '/account/profile') : '/choose-role'
    toast.add({ 
      title: t('auth.loginSuccess'), 
      color: 'success' 
    })
    await router.push(target)
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
  <div class="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-8">
    <UPageCard class="w-full max-w-md">
      <UAuthForm
        :schema="schema"
        :title="t('auth.login')"
        :description="t('auth.loginDescription')"
        icon="i-lucide-user"
        :fields="fields"
        :providers="providers"
        :loading="isLoading"
        @submit="onSubmit"
      >
        <template #footer>
          <div class="text-center text-sm text-muted mt-4 space-y-2">
            <div>
              {{ t('auth.noAccount') }}
              <ULink to="/register" class="font-medium">
                {{ t('auth.register') }}
              </ULink>
            </div>
            <div>
              <ULink to="/forgot-password" class="font-medium">
                {{ t('auth.forgotPassword') }}
              </ULink>
            </div>
          </div>
        </template>
      </UAuthForm>
    </UPageCard>
  </div>
</template>

