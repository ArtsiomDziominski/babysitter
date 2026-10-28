<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'

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

const schema = z.object({
  email: z.string().email(t('auth.invalidEmail'))
})

type Schema = z.output<typeof schema>

function onSubmit(payload: FormSubmitEvent<Schema>) {
  console.log('Password reset requested', payload)
  toast.add({ title: t('auth.resetPasswordSuccess'), description: t('auth.resetPasswordEmailSent'), color: 'success' })
}
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[calc(100vh-var(--ui-header-height))] py-10">
    <UPageCard variant="outline" class="w-full max-w-md bg-default" :ui="{ container: 'sm:p-8' }">
      <UAuthForm
        :schema="schema"
        :title="t('auth.resetPassword')"
        :description="t('auth.resetPasswordDescription')"
        icon="i-lucide-key"
        :fields="fields"
        :submit="{ label: t('auth.resetPassword'), block: true }"
        @submit="onSubmit"
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
    </UPageCard>
  </div>
</template>

