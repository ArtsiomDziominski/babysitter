<template>
  <UHeader to="/" mode="slideover" :ui="{ title: 'items-center gap-2' }">
    <template #title>
      <img :src="siteConfig.logo" :alt="siteConfig.name" class="size-8 rounded-md object-contain"/>
      <span class="text-lg font-semibold text-highlighted">{{ siteConfig.name }}</span>
    </template>

    <UNavigationMenu :items="navItems" variant="link" />

    <template #right>
      <ClientOnly>
        <USelect
            v-if="localeOptions.length > 0"
            :model-value="locale"
            :items="localeOptions"
            labelKey="name"
            valueKey="code"
            variant="ghost"
            icon="i-lucide-globe"
            class="max-lg:hidden w-36"
            @update:model-value="(value) => setLocale(value as 'ka' | 'en' | 'ru' | 'uk')"
        />
        <template #fallback>
          <div class="max-lg:hidden w-36 h-8 rounded-md bg-elevated animate-pulse"></div>
        </template>
      </ClientOnly>

      <UColorModeButton />

      <ClientOnly>
        <UButton v-if="!authStore.isAuthenticated" color="primary" to="/login" class="max-lg:hidden">
          {{ $t('header.login') }}
        </UButton>
        <UDropdownMenu v-else :items="accountMenuItems" :content="{ align: 'end' }">
          <UAvatar
              :src="authStore.currentUser?.avatar"
              :alt="authStore.currentUser?.name"
              size="md"
              class="cursor-pointer ring-2 ring-transparent hover:ring-primary transition"
          />
        </UDropdownMenu>
        <template #fallback>
          <div class="size-8 rounded-full bg-elevated animate-pulse"></div>
        </template>
      </ClientOnly>
    </template>

    <template #body>
      <MobileMenu :nav-links="navLinks" />
    </template>
  </UHeader>
</template>

<script setup lang="ts">
const { locale, locales, t, setLocale } = useI18n()
const authStore = useAuthStore()
const siteConfig = useSiteConfig()

const navLinks = computed(() => {
  const nav = [
    { to: '/search', label: t('header.bookings') },
    { to: '/blog', label: t('header.blog') }
  ]
  if (authStore.isAuthenticated) nav.push({ to: '/account/messages', label: t('header.messages') })
  return nav
})

const navItems = computed(() => navLinks.value.map(link => ({ label: link.label, to: link.to })))

onMounted(() => {
  authStore.loadAvatarUrl()
})

const localeOptions = computed(() => locales.value ?? [])

const accountMenuItems = computed(() => {
  const user = authStore.currentUser

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
    [
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
    ],
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
