<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'

const { t } = useI18n()
const toast = useToast()

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
  <div class="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-8">
    <UPageCard class="w-full max-w-md">
      <UAuthForm
        :schema="schema"
        :title="t('auth.resetPassword')"
        :description="t('auth.resetPasswordDescription')"
        icon="i-lucide-key"
        :fields="fields"
        @submit="onSubmit"
      >
        <template #footer>
          <div class="text-center text-sm text-muted mt-4 space-y-2">
            <div>
              {{ t('auth.rememberPassword') }}
              <ULink to="/login" class="font-medium">
                {{ t('auth.login') }}
              </ULink>
            </div>
          </div>
        </template>
      </UAuthForm>
    </UPageCard>
  </div>
</template>

