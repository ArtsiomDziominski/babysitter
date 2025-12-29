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
          <UButton
              color="neutral"
              variant="ghost"
              icon="i-lucide-menu"
              class="xl:hidden mr-2"
              @click="isMobileMenuOpen = !isMobileMenuOpen"
          />

          <div class="max-xl:hidden">
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

      <div v-if="isMobileMenuOpen" class="xl:hidden border-t border-gray-200 dark:border-gray-800">
        <nav class="py-4 space-y-2">
          <NuxtLink
              v-for="item in navLinks"
              :key="item.to"
              :to="item.to"
              class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
              @click="isMobileMenuOpen = false"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>
        <div class="px-4 pb-4 space-y-3">
          <ClientOnly>
            <template v-if="localeOptions.length > 0">
              <USelect
                  :model-value="locale"
                  :items="localeOptions"
                  labelKey="name"
                  valueKey="code"
                  @update:model-value="(value) => setLocale(value as 'ka' | 'en' | 'ru' | 'uk')"
                  size="sm"
                  class="w-full"
              />
            </template>
            <template v-if="!authStore.isAuthenticated">
              <UButton color="primary" to="/login" variant="solid" size="sm" class="w-full" @click="isMobileMenuOpen = false">
                {{ $t('header.login') }}
              </UButton>
            </template>
            <template v-else>
              <div class="space-y-2">
                <div class="flex items-center gap-3 px-2 py-2">
                  <UAvatar
                      :src="authStore.currentUser?.avatar"
                      :alt="authStore.currentUser?.name"
                      size="sm"
                  />
                  <span class="text-sm font-medium text-gray-900 dark:text-white">{{ authStore.currentUser?.name }}</span>
                </div>
                <template v-for="(group, groupIndex) in accountMenuItems" :key="groupIndex">
                  <template v-for="item in group" :key="item.label">
                    <div
                        v-if="item.type === 'label'"
                        class="px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase"
                    >
                      {{ item.label }}
                    </div>
                    <NuxtLink
                        v-else-if="item.to"
                        :to="item.to"
                        class="block px-2 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                        @click="isMobileMenuOpen = false"
                    >
                      <div class="flex items-center gap-2">
                        <Icon v-if="item.icon" :name="item.icon" size="16"/>
                        <span>{{ item.label }}</span>
                      </div>
                    </NuxtLink>
                    <button
                        v-else-if="item.onSelect"
                        class="w-full text-left block px-2 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                        @click="isMobileMenuOpen = false; item.onSelect()"
                    >
                      <div class="flex items-center gap-2">
                        <Icon v-if="item.icon" :name="item.icon" size="16"/>
                        <span>{{ item.label }}</span>
                      </div>
                    </button>
                  </template>
                </template>
              </div>
            </template>
          </ClientOnly>
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

const isMobileMenuOpen = ref(false)
</script>
