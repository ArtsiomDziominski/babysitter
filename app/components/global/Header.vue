<template>
  <header class="header">
    <div class="header__container">
      <div class="header__content">
        <NuxtLink to="/" class="header__logo">
          <img :src="siteConfig.logo" :alt="siteConfig.name" class="header__logo-icon"/>
          <span class="header__logo-text max-xl:hidden">{{ siteConfig.name }}</span>
        </NuxtLink>

        <nav class="header__nav max-xl:hidden">
          <NuxtLink
              v-for="item in navLinks"
              :key="item.to"
              :to="item.to"
              class="header__nav-link"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <div class="header__controls max-xl:flex-1 max-xl:justify-end">
          <MobileMenu :nav-links="navLinks" />

          <div class="max-xl:hidden flex items-center gap-1">
          <ClientOnly>
            <template v-if="localeOptions.length > 0">
              <div class="header__selects">
                <USelect
                    :model-value="locale"
                    :items="localeOptions"
                    labelKey="name"
                    valueKey="code"
                    @update:model-value="(value) => setLocale(value as 'ka' | 'en' | 'ru' | 'uk')"
                    class="header__select header__select--locale"
                />
              </div>
            </template>
            <template #fallback>
              <div class="header__select-fallback"></div>
              <div class="header__select-fallback header__select-fallback--locale"></div>
            </template>
          </ClientOnly>

          <ClientOnly>
            <template v-if="!authStore.isAuthenticated">
              <UButton color="primary" to="/login" variant="solid">
                {{ $t('header.login') }}
              </UButton>
            </template>
            <template v-else>
              <div class="header__auth">
                <UDropdownMenu :items="accountMenuItems" :popper="{ placement: 'bottom-end' }">
                  <UAvatar
                      :src="authStore.currentUser?.avatar"
                      :alt="authStore.currentUser?.name"
                      size="md"
                      class="header__avatar"
                  />
                </UDropdownMenu>
              </div>
            </template>
            <template #fallback>
              <div class="header__auth-fallback"></div>
            </template>
          </ClientOnly>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { UserRole } from '~/const/roles'

const { locale, locales, t, setLocale } = useI18n()
const authStore = useAuthStore()
const siteConfig = useSiteConfig()

const navLinks = computed(() => {
  const nav = [{ to: '/search', label: t('header.bookings') }]
  if (authStore.isAuthenticated) nav.push({ to: '/account/messages', label: t('header.messages') })
  return nav
})

onMounted(() => {
  authStore.loadAvatarUrl()
})

const localeOptions = computed(() => {
  if (!locales.value || locales.value.length === 0) {
    return []
  }
  return locales.value
})

const accountMenuItems = computed(() => {
  const role = authStore.currentUser?.role
  const user = authStore.currentUser

  const mainMenuItems = [
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
  ]

  if (role === UserRole.PARENT) {
    // mainMenuItems.push({
    //   label: t('header.menu.favorites'),
    //   icon: 'i-lucide-heart',
    //   to: '/account/favorites'
    // })
  } else if (role === UserRole.BABYSITTER) {
    // mainMenuItems.push({
    //   label: t('header.menu.schedule'),
    //   icon: 'i-lucide-calendar-clock',
    //   to: '/account/schedule'
    // })
  }

  return [
    [
      {
        label: user?.name || '',
        avatar: {
          src: user?.avatar
        },
        type: 'label'
      }
    ],
    mainMenuItems,
    // [
    //   {
    //     label: t('header.menu.settings'),
    //     icon: 'i-lucide-settings',
    //     to: '/account/settings'
    //   }
    // ],
    [
      {
        label: t('header.logout'),
        icon: 'i-lucide-log-out',
        onSelect: () => handleLogout()
      }
    ]
  ]
})

const handleLogout = () => {
  authStore.logout()
  navigateTo('/')
}
</script>
