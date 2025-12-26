<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'

const { t, locale } = useI18n()
const toast = useToast()
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const siteConfig = useSiteConfig()

const currentUrl = `${siteConfig.url}${route.path}`

useSeoMeta({
  title: () => t('seo.register.title'),
  description: () => t('seo.register.description'),
  robots: 'noindex, nofollow',
  ogTitle: () => t('seo.register.title'),
  ogDescription: () => t('seo.register.description'),
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
    name: 'name',
    type: 'text',
    label: t('auth.name'),
    placeholder: t('auth.namePlaceholder'),
    required: true
  },
  {
    name: 'surname',
    type: 'text',
    label: t('auth.surname'),
    placeholder: t('auth.surnamePlaceholder'),
    required: true
  },
  {
    name: 'email',
    type: 'email',
    label: t('auth.email'),
    placeholder: t('auth.emailPlaceholder'),
    required: true
  },
  {
    name: 'phone',
    type: 'text',
    label: t('auth.phone'),
    placeholder: t('auth.phonePlaceholder'),
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
    name: 'confirmPassword',
    label: t('auth.confirmPassword'),
    type: 'password',
    placeholder: t('auth.confirmPasswordPlaceholder'),
    required: true
  },
  {
    name: 'agree',
    label: t('auth.agreeToTerms'),
    type: 'checkbox',
    required: true
  }
]

const providers = [
  {
    label: 'Google',
    icon: 'i-simple-icons-google',
    onClick: () => {
      toast.add({ title: 'Google', description: t('auth.registerWithGoogle') })
    }
  },
  {
    label: 'Яндекс',
    icon: 'i-simple-icons-yandexinternational',
    onClick: () => {
      toast.add({ title: 'Яндекс', description: t('auth.registerWithYandex') })
    }
  },
  {
    label: 'VK',
    icon: 'i-simple-icons-vk',
    onClick: () => {
      toast.add({ title: 'VK', description: t('auth.registerWithVK') })
    }
  }
]

const schema = z.object({
  name: z.string().min(2, t('auth.nameMinLength')),
  surname: z.string().min(2, t('auth.surnameMinLength')),
  email: z.string().email(t('auth.invalidEmail')),
  phone: z.string().min(10, t('auth.phoneMinLength')),
  password: z.string().min(8, t('auth.passwordMinLength')),
  confirmPassword: z.string(),
  agree: z.boolean().refine(val => val === true, t('auth.mustAgree'))
}).refine(data => data.password === data.confirmPassword, {
  message: t('auth.passwordsDoNotMatch'),
  path: ['confirmPassword']
})

type Schema = z.output<typeof schema>

const isLoading = ref(false)

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  isLoading.value = true
  try {
    await authStore.register({
      firstName: payload.data.name,
      lastName: payload.data.surname,
      email: payload.data.email,
      phone: payload.data.phone,
      password: payload.data.password
    })
    toast.add({ 
      title: t('auth.registerSuccess'), 
      color: 'success' 
    })
    await router.push('/choose-role')
  } catch (error: any) {
    const errorMessage = error?.message || error?.details?.[0]?.message || t('auth.registerError')
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
        :title="t('auth.register')"
        :description="t('auth.registerDescription')"
        icon="i-lucide-user-plus"
        :fields="fields"
        :providers="providers"
        :loading="isLoading"
        @submit="onSubmit"
      >
        <template #footer>
          <div class="text-center text-sm text-muted mt-4">
            {{ t('auth.haveAccount') }}
            <ULink to="/login" class="font-medium">
              {{ t('auth.login') }}
            </ULink>
          </div>
        </template>
      </UAuthForm>
    </UPageCard>
  </div>
</template>

