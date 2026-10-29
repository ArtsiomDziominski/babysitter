<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'

const { t, locale } = useI18n()
const toast = useToast()
const authStore = useAuthStore()
const router = useRouter()
const localePath = useLocalePath()
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
  ogType: 'website'
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

const { email, password, requiredString, focusFirstError } = useFormValidation()

const schema = z.object({
  name: requiredString().min(2, { error: () => t('auth.nameMinLength') }),
  surname: requiredString().min(2, { error: () => t('auth.surnameMinLength') }),
  email: email(),
  phone: requiredString().min(10, { error: () => t('auth.phoneMinLength') }),
  password: password(),
  confirmPassword: requiredString({ trim: false }),
  agree: z.boolean({ error: () => t('auth.mustAgree') }).refine(val => val === true, { error: () => t('auth.mustAgree') })
}).refine(data => data.password === data.confirmPassword, {
  error: () => t('auth.passwordsDoNotMatch'),
  path: ['confirmPassword'],
  // Сравниваем пароли, даже если другие поля ещё не заполнены
  when: payload => typeof payload.value === 'object' && payload.value !== null
    && 'password' in payload.value && 'confirmPassword' in payload.value
})

const authForm = useTemplateRef('authForm')

type Schema = z.output<typeof schema>

const isLoading = ref(false)

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  isLoading.value = true
  try {
    const response = await authStore.register({
      firstName: payload.data.name,
      lastName: payload.data.surname,
      email: payload.data.email,
      phone: payload.data.phone,
      password: payload.data.password
    })
    toast.add({
      title: t('auth.verifyEmail.codeSent'),
      color: 'success'
    })
    await router.push(localePath({ path: '/verify-email', query: { email: response.email ?? payload.data.email } }))
  } catch (error: any) {
    // Занятый email подсвечиваем у самого поля, а не только всплывашкой
    if (error?.statusCode === 409) {
      authForm.value?.formRef?.setErrors([{ name: 'email', message: t('auth.emailTaken') }], 'email')
      document.querySelector<HTMLInputElement>('input[name="email"]')?.focus()
      return
    }
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
  <div class="flex flex-col items-center justify-center min-h-[calc(100vh-var(--ui-header-height))] py-10">
    <UPageCard variant="outline" class="w-full max-w-md bg-default" :ui="{ container: 'sm:p-8' }">
      <UAuthForm
        ref="authForm"
        :schema="schema"
        :title="t('auth.register')"
        :description="t('auth.registerDescription')"
        icon="i-lucide-user-plus"
        :fields="fields"
        :submit="{ label: t('auth.register'), block: true }"
        :loading="isLoading"
        @submit="onSubmit"
        @error="focusFirstError"
      >
        <template #footer>
          <div class="text-center text-sm text-muted mt-4">
            {{ t('auth.haveAccount') }}
            <ULink :to="localePath('/login')" class="font-medium">
              {{ t('auth.login') }}
            </ULink>
          </div>
        </template>
      </UAuthForm>
    </UPageCard>
  </div>
</template>

