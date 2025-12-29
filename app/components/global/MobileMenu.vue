<template>
  <UDropdownMenu
      :items="dropdownItems"
      :popper="{ placement: 'bottom-end' }"
      class="xl:hidden"
  >
    <UButton
        color="neutral"
        variant="ghost"
        icon="i-lucide-menu"
        class="xl:hidden mr-2"
    />

    <template #content-top>
      <ClientOnly>
        <template v-if="localeOptions.length > 0">
          <div class="p-2">
            <USelect
                :model-value="locale"
                :items="localeOptions"
                labelKey="name"
                valueKey="code"
                @update:model-value="(value) => setLocale(value as 'ka' | 'en' | 'ru' | 'uk')"
                size="sm"
                class="w-full"
            />
          </div>
        </template>
      </ClientOnly>
    </template>

    <template #content-bottom>
      <ClientOnly>
        <template v-if="!authStore.isAuthenticated">
          <div class="p-2">
            <UButton color="primary" to="/login" variant="solid" size="sm" class="w-full">
              {{ $t('header.login') }}
            </UButton>
          </div>
        </template>
      </ClientOnly>
    </template>
  </UDropdownMenu>
</template>

<script setup lang="ts">
import { UserRole } from '~/const/roles'

const { locale, locales, t, setLocale } = useI18n()
const authStore = useAuthStore()

const props = defineProps<{
  navLinks: Array<{ to: string; label: string }>
}>()

const localeOptions = computed(() => {
  if (!locales.value || locales.value.length === 0) {
    return []
  }
  return locales.value
})

const dropdownItems = computed(() => {
  const items: any[] = []

  // Навигационные ссылки
  if (props.navLinks.length > 0) {
    items.push(
      props.navLinks.map(link => ({
        label: link.label,
        to: link.to
      }))
    )
  }

  // Меню аккаунта (если авторизован)
  if (authStore.isAuthenticated) {
    const user = authStore.currentUser
    
    // Информация о пользователе
    items.push([
      {
        label: user?.name || '',
        avatar: {
          src: user?.avatar
        },
        type: 'label'
      }
    ])

    // Пункты меню
    items.push([
      {
        label: t('header.menu.profile'),
        icon: 'i-lucide-user',
        to: '/account/profile'
      },
      {
        label: t('header.menu.order'),
        icon: 'i-lucide-clipboard-list',
        to: '/account/orders'
      },
      {
        label: t('header.menu.messages'),
        icon: 'i-lucide-message-square',
        to: '/account/messages'
      }
    ])

    // Выход
    items.push([
      {
        label: t('header.logout'),
        icon: 'i-lucide-log-out',
        onSelect: () => handleLogout()
      }
    ])
  }

  return items
})

const handleLogout = () => {
  authStore.logout()
  navigateTo('/')
}
</script>

