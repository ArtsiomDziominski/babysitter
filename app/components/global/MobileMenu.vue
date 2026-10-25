<template>
  <div class="flex flex-col gap-6">
    <UNavigationMenu :items="navItems" orientation="vertical" class="-mx-2.5" />

    <ClientOnly>
      <template v-if="authStore.isAuthenticated">
        <USeparator />
        <div class="flex items-center gap-3">
          <UAvatar :src="authStore.currentUser?.avatar" :alt="authStore.currentUser?.name" size="md" />
          <span class="font-medium text-highlighted truncate">{{ authStore.currentUser?.name }}</span>
        </div>
        <UNavigationMenu :items="accountItems" orientation="vertical" class="-mx-2.5" />
      </template>
    </ClientOnly>

    <USeparator />

    <ClientOnly>
      <USelect
          v-if="localeOptions.length > 0"
          :model-value="locale"
          :items="localeOptions"
          labelKey="name"
          valueKey="code"
          icon="i-lucide-globe"
          class="w-full"
          @update:model-value="(value) => setLocale(value as 'ka' | 'en' | 'ru' | 'uk')"
      />
    </ClientOnly>

    <ClientOnly>
      <UButton v-if="!authStore.isAuthenticated" color="primary" to="/login" block>
        {{ $t('header.login') }}
      </UButton>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
const { locale, locales, t, setLocale } = useI18n()
const authStore = useAuthStore()

const props = defineProps<{
  navLinks: Array<{ to: string; label: string }>
}>()

const localeOptions = computed(() => locales.value ?? [])

const navItems = computed(() => props.navLinks.map(link => ({ label: link.label, to: link.to })))

const accountItems = computed(() => [
  { label: t('header.menu.profile'), icon: 'i-lucide-user', to: '/account/profile' },
  { label: t('header.menu.order'), icon: 'i-lucide-clipboard-list', to: '/account/orders' },
  { label: t('header.menu.messages'), icon: 'i-lucide-message-square', to: '/account/messages' },
  { label: t('header.logout'), icon: 'i-lucide-log-out', onSelect: () => handleLogout() }
])

const handleLogout = () => {
  authStore.logout()
  navigateTo('/')
}
</script>
