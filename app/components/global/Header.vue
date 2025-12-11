<template>
  <header class="border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 bg-white dark:bg-gray-900">
    <UContainer>
      <div class="flex items-center justify-between gap-4 py-4">
        <NuxtLink to="/"
                  class="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white hover:text-primary-500 transition-colors">
          <Icon name="mdi:account-child" size="32"/>
          <span>Babysitter</span>
        </NuxtLink>

        <div class="flex items-center gap-3">
          <USelect
              v-model="selectedCity"
              :items="cityOptions"
              labelKey="label"
              valueKey="value"
              class="min-w-[150px]"
          />
          <USelect
              :model-value="locale"
              :items="localeOptions"
              labelKey="name"
              valueKey="code"
              @update:model-value="(value) => setLocale(value as 'ru' | 'en' | 'be')"
              class="min-w-[120px]"
          />

          <template v-if="!authStore.isAuthenticated">
            <UButton color="primary" to="/login">
              {{ $t('header.login') }}
            </UButton>
          </template>
          <template v-else>
            <UDropdownMenu :items="accountMenuItems" :popper="{ placement: 'bottom-end' }">
              <UAvatar
                  :src="authStore.currentUser?.avatar"
                  :alt="authStore.currentUser?.name"
                  size="md"
                  class="cursor-pointer hover:ring-2 hover:ring-primary-500 transition-all"
              />
            </UDropdownMenu>
          </template>
        </div>
      </div>
    </UContainer>
  </header>
</template>

<script setup lang="ts">
const { locale, locales, t, setLocale } = useI18n()
const authStore = useAuthStore()

const cityKeys = ['minsk', 'gomel', 'vitebsk', 'grodno', 'brest', 'mogilev']
const selectedCity = useState('selectedCity', () => cityKeys[0])

const cityOptions = computed(() =>
    cityKeys.map(key => ({
      label: t(`cities.${ key }`),
      value: key
    }))
)

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
      to: '/account'
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
