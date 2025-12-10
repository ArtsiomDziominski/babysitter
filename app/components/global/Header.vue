<template>
  <header class="border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 bg-white dark:bg-gray-900">
    <UContainer>
      <div class="flex items-center justify-between gap-4 py-4">
        <NuxtLink to="/"
                  class="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white hover:text-primary-500 transition-colors">
          <Icon name="mdi:account-child" size="32"/>
          <span>Babysitter</span>
        </NuxtLink>

        <div>
          <UButton
              v-for="link in navLinks"
              :key="link.to"
              :to="link.to"
              variant="ghost"
              color="neutral"
          >
            {{ $t(link.label) }}
          </UButton>
        </div>

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

          <template v-if="!isAuthenticated">
            <UButton color="primary" @click="handleLogin">
              {{ $t('header.login') }}
            </UButton>
          </template>
          <template v-else>
            <div class="flex items-center gap-4">
              <UButton color="error" variant="solid" @click="handleLogout">
                {{ $t('header.logout') }}
              </UButton>
            </div>
          </template>
        </div>
      </div>
    </UContainer>
  </header>
</template>

<script setup lang="ts">
const { locale, locales, t, setLocale } = useI18n()

const cityKeys = ['minsk', 'gomel', 'vitebsk', 'grodno', 'brest', 'mogilev']
const selectedCity = useState('selectedCity', () => cityKeys[0])
const isAuthenticated = useState('isAuthenticated', () => false)

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

const navLinks = [
  { to: '/profile', label: 'header.profile' },
  { to: '/bookings', label: 'header.bookings' },
  { to: '/messages', label: 'header.messages' }
]

const handleLogin = () => {
  isAuthenticated.value = true
}

const handleLogout = () => {
  isAuthenticated.value = false
}
</script>
