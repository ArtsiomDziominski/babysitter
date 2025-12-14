<template>
  <header class="header">
    <div class="header__container">
      <div class="header__content">
        <NuxtLink to="/" class="header__logo">
          <Icon name="mdi:account-child" size="32" class="header__logo-icon"/>
          <span class="header__logo-text">Babysitter</span>
        </NuxtLink>

        <nav v-if="authStore.isAuthenticated" class="header__nav">
          <NuxtLink to="/search" class="header__nav-link">
            {{ $t('header.bookings') }}
          </NuxtLink>
          <NuxtLink to="/account/messages" class="header__nav-link">
            {{ $t('header.messages') }}
          </NuxtLink>
        </nav>

        <div class="header__controls">
          <ClientOnly>
            <template v-if="authStore.isAuthenticated">
              <div class="header__role-switcher">
                <UButtonGroup>
                  <UButton
                    :variant="authStore.currentUser?.role === 'parent' ? 'solid' : 'outline'"
                    :color="authStore.currentUser?.role === 'parent' ? 'primary' : 'gray'"
                    size="sm"
                    @click="authStore.setRole('parent')"
                  >
                    {{ $t('account.role.parent') }}
                  </UButton>
                  <UButton
                    :variant="authStore.currentUser?.role === 'nanny' ? 'solid' : 'outline'"
                    :color="authStore.currentUser?.role === 'nanny' ? 'primary' : 'gray'"
                    size="sm"
                    @click="authStore.setRole('nanny')"
                  >
                    {{ $t('account.role.nanny') }}
                  </UButton>
                </UButtonGroup>
              </div>
            </template>
            <template v-if="cityOptions.length > 0 && localeOptions.length > 0">
              <div class="header__selects">
                <USelect
                    v-model="selectedCity"
                    :items="cityOptions"
                    labelKey="label"
                    valueKey="value"
                    class="header__select"
                />
                <USelect
                    :model-value="locale"
                    :items="localeOptions"
                    labelKey="name"
                    valueKey="code"
                    @update:model-value="(value) => setLocale(value as 'ru' | 'en' | 'be')"
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
  </header>
</template>

<script setup lang="ts">
const { locale, locales, t, setLocale } = useI18n()
const authStore = useAuthStore()

const cityKeys = ['minsk', 'gomel', 'vitebsk', 'grodno', 'brest', 'mogilev']
const selectedCity = useState('selectedCity', () => cityKeys[0])

const cityOptions = computed(() => {
  try {
    return cityKeys.map(key => ({
      label: t(`cities.${ key }`),
      value: key
    }))
  } catch {
    return []
  }
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
      label: t('header.menu.account'),
      icon: 'i-lucide-user',
      to: '/account/profile'
    },
    {
      label: t('header.menu.bookings'),
      icon: 'i-lucide-calendar',
      to: '/account/bookings'
    },
    {
      label: t('header.menu.messages'),
      icon: 'i-lucide-message-square',
      to: '/account/messages'
    }
  ]

  if (role === 'parent') {
    mainMenuItems.push({
      label: t('header.menu.favorites'),
      icon: 'i-lucide-heart',
      to: '/account/favorites'
    })
  } else if (role === 'nanny') {
    mainMenuItems.push({
      label: t('header.menu.schedule'),
      icon: 'i-lucide-calendar-clock',
      to: '/account/schedule'
    })
  }

  const items = [
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
    [
      {
        label: t('header.menu.settings'),
        icon: 'i-lucide-settings',
        to: '/account/settings'
      }
    ],
    [
      {
        label: t('header.logout'),
        icon: 'i-lucide-log-out',
        click: () => handleLogout()
      }
    ]
  ]

  return items
})

const handleLogout = () => {
  authStore.logout()
  navigateTo('/')
}
</script>
