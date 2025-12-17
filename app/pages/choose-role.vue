<script setup lang="ts">
definePageMeta({
  layout: 'role',
  middleware: 'auth'
})

const { t } = useI18n()
const authStore = useAuthStore()
const router = useRouter()
const toast = useToast()

type RoleOption = { label: string; value: 'parent' | 'nanny'; description: string }

const options = computed<RoleOption[]>(() => [
  { label: t('roleSelection.parent.title'), value: 'parent', description: t('roleSelection.parent.description') },
  { label: t('roleSelection.nanny.title'), value: 'nanny', description: t('roleSelection.nanny.description') }
])

const selectedRole = ref<'parent' | 'nanny'>(authStore.user.role ?? 'parent')
const isSubmitting = ref(false)

const redirectByRole = (role: 'parent' | 'nanny') => (role === 'parent' ? '/search' : '/account/profile')

onMounted(() => {
  if (authStore.user.role) {
    router.replace(redirectByRole(authStore.user.role))
  }
})

const onSelect = async (role: 'parent' | 'nanny') => {
  selectedRole.value = role
}

const submit = async () => {
  if (!selectedRole.value) {
    toast.add({ title: t('roleSelection.selectPrompt'), color: 'error' })
    return
  }

  isSubmitting.value = true
  try {
    await authStore.saveRole(selectedRole.value)
    toast.add({ title: t('roleSelection.saved'), color: 'success' })
    await authStore.fetchProfile()
    await router.replace(redirectByRole(selectedRole.value))
  } catch (error: any) {
    const message = error?.message || error?.details?.[0]?.message || t('roleSelection.saveErrorDefault')
    toast.add({ title: message, color: 'error' })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="max-w-xl mx-auto space-y-6">
    <div class="space-y-2 text-center">
      <h1 class="text-2xl font-semibold">{{ t('roleSelection.title') }}</h1>
      <p class="text-muted">{{ t('roleSelection.subtitle') }}</p>
    </div>

    <div class="grid gap-4">
      <UCard
        v-for="option in options"
        :key="option.value"
        :class="[
          'cursor-pointer transition ring-1 ring-border hover:ring-primary/60',
          selectedRole === option.value ? 'ring-2 ring-primary' : ''
        ]"
        @click="onSelect(option.value)"
      >
        <div class="flex items-start justify-between">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="text-lg font-semibold">{{ option.label }}</span>
              <UBadge v-if="selectedRole === option.value" color="primary" variant="soft" size="sm">
                {{ t('roleSelection.selected') }}
              </UBadge>
            </div>
            <p class="text-sm text-muted">{{ option.description }}</p>
          </div>
          <UCheckbox :model-value="selectedRole === option.value" disabled />
        </div>
      </UCard>
      <div class="flex justify-end">
        <UButton :loading="isSubmitting" :disabled="isSubmitting" @click="submit">
          {{ t('roleSelection.continue') }}
        </UButton>
      </div>
    </div>
  </div>
</template>

