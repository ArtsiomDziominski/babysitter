<script setup lang="ts">
import { UserRole } from '~/const/roles'

const localePath = useLocalePath()
const { t, locale, locales, setLocale } = useI18n()
const authStore = useAuthStore()
const colorMode = useColorMode()
const route = useRoute()

const localizedBecomeSitterUrls: Record<string, string> = {
  ru: '/kak-stat-bebisitterom',
  en: '/how-to-become-babysitter',
  uk: '/yak-staty-bebisiterom',
  be: '/yak-stats-bebisiteram',
  ka: '/rogor-gavides-bebisiteri'
}

const becomeSitterUrl = computed(() => localizedBecomeSitterUrls[locale.value] || localizedBecomeSitterUrls.ru)

const role = computed(() => authStore.currentUser?.role)

// Role-specific page in the account: parents fill in their kids, babysitters their profile
const roleLink = computed(() => {
  if (role.value === UserRole.PARENT) return { to: '/account/booking/kids', label: t('header.nav.kids'), icon: 'i-lucide-baby' }
  if (role.value === UserRole.BABYSITTER) return { to: '/account/booking/babysitter', label: t('header.nav.sitterProfile'), icon: 'i-lucide-id-card' }
  return null
})

const navLinks = computed(() => {
  if (!authStore.isAuthenticated) {
    return [
      { to: '/search', label: t('header.findSitter') },
      { to: becomeSitterUrl.value, label: t('header.becomeSitter') },
      { to: '/blog', label: t('header.blog') }
    ]
  }
  if (!role.value) {
    return [
      { to: '/search', label: t('header.findSitter') },
      { to: '/choose-role', label: t('header.nav.chooseRole') },
      { to: '/blog', label: t('header.blog') }
    ]
  }
  if (role.value === UserRole.BABYSITTER) {
    return [
      { to: '/account/booking/babysitter', label: t('header.nav.sitterProfile') },
      { to: '/account/orders', label: t('header.menu.order') },
      { to: '/account/messages', label: t('header.messages') }
    ]
  }
  return [
    { to: '/search', label: t('header.findSitter') },
    { to: '/account/orders', label: t('header.menu.order') },
    { to: '/account/messages', label: t('header.messages') }
  ]
})

const isOn = (to: string) => {
  const target = localePath(to)
  return route.path === target || route.path.startsWith(`${target}/`)
}

type LocaleCode = 'ka' | 'en' | 'ru' | 'uk'
const localeOptions = computed(() => (locales.value ?? []) as Array<{ code: LocaleCode; name?: string }>)
const currentLocaleName = computed(() => localeOptions.value.find(l => l.code === locale.value)?.name || locale.value)

const localeItems = computed(() => localeOptions.value.map(l => ({
  label: l.name || l.code,
  onSelect: () => setLocale(l.code)
})))

const accountMenuItems = computed(() => [
  [{ label: authStore.currentUser?.name || '', avatar: { src: authStore.avatarSrc }, type: 'label' as const }],
  [
    { label: t('header.menu.profile'), icon: 'i-lucide-user', to: localePath('/account/profile') },
    ...(roleLink.value ? [{ label: roleLink.value.label, icon: roleLink.value.icon, to: localePath(roleLink.value.to) }] : []),
    { label: t('header.menu.order'), icon: 'i-lucide-clipboard-list', to: localePath('/account/orders') },
    { label: t('header.menu.messages'), icon: 'i-lucide-message-square', to: localePath('/account/messages') }
  ],
  [{ label: t('header.logout'), icon: 'i-lucide-log-out', onSelect: () => handleLogout() }]
])

const handleLogout = () => {
  authStore.logout()
  navigateTo(localePath('/'))
}

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const menuOpen = ref(false)
watch(() => route.fullPath, () => { menuOpen.value = false })

const scrolled = ref(false)
const onScroll = () => { scrolled.value = window.scrollY > 8 }

onMounted(() => {
  authStore.loadAvatarUrl()
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <header class="hdr" :class="{ scrolled }">
    <div class="wrap">
      <NuxtLink :to="localePath('/')" class="brand" :aria-label="t('header.home')">
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <rect width="64" height="64" rx="18" fill="#E8573A" />
          <path fill="none" stroke="#fff" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" d="M14 29 32 15l18 14" />
          <path fill="#fff" d="M32 51c-8.4-5.6-12.5-10.2-12.5-15.3 0-3.7 2.9-6.6 6.4-6.6 2.6 0 4.8 1.4 6.1 3.6 1.3-2.2 3.5-3.6 6.1-3.6 3.5 0 6.4 2.9 6.4 6.6 0 5.1-4.1 9.7-12.5 15.3Z" />
        </svg>
        <span>Sitter<span class="ge">.ge</span></span>
      </NuxtLink>

      <nav class="nav" :aria-label="t('header.mainNav')">
        <NuxtLink v-for="link in navLinks" :key="link.to" :to="localePath(link.to)" :class="{ on: isOn(link.to) }">{{ link.label }}</NuxtLink>
      </nav>

      <div class="hdr-right">
        <UDropdownMenu v-if="localeItems.length > 0" :items="localeItems" :content="{ align: 'end' }">
          <button type="button" class="chipbtn" :aria-label="`${t('header.language')}: ${currentLocaleName}`">
            <UIcon name="i-lucide-globe" class="ico" />
            {{ currentLocaleName }}
            <UIcon name="i-lucide-chevron-down" class="size-3" />
          </button>
        </UDropdownMenu>

        <button type="button" class="iconbtn" :aria-label="t('header.toggleTheme')" @click="toggleTheme">
          <UIcon name="i-lucide-sun" class="ico sun" />
          <UIcon name="i-lucide-moon" class="ico moon" />
        </button>

        <ClientOnly>
          <NuxtLink v-if="!authStore.isAuthenticated" :to="localePath('/login')" class="btn btn-ink">{{ t('header.login') }}</NuxtLink>
          <UDropdownMenu v-else :items="accountMenuItems" :content="{ align: 'end' }">
            <button type="button" class="acc" :aria-label="authStore.currentUser?.name || t('header.profile')">
              <img v-if="authStore.avatarSrc" :src="authStore.avatarSrc" :alt="authStore.currentUser?.name">
              <UIcon v-else name="i-lucide-user" class="ico" />
            </button>
          </UDropdownMenu>
        </ClientOnly>

        <button
          type="button"
          class="iconbtn burger"
          :aria-label="t('header.openMenu')"
          :aria-expanded="menuOpen"
          aria-controls="site-mnav"
          @click="menuOpen = !menuOpen"
        >
          <UIcon name="i-lucide-menu" class="ico" />
        </button>
      </div>

      <nav id="site-mnav" class="mnav" :class="{ open: menuOpen }" :aria-label="t('header.mobileNav')">
        <NuxtLink v-for="link in navLinks" :key="link.to" :to="localePath(link.to)">{{ link.label }}</NuxtLink>
        <div v-if="localeOptions.length > 0" class="langs" :aria-label="t('header.language')">
          <button
            v-for="l in localeOptions"
            :key="l.code"
            type="button"
            :class="{ on: l.code === locale }"
            @click="setLocale(l.code)"
          >
            {{ l.name || l.code }}
          </button>
        </div>
        <ClientOnly>
          <NuxtLink v-if="!authStore.isAuthenticated" :to="localePath('/login')" class="btn btn-ink">{{ t('header.login') }}</NuxtLink>
          <template v-else>
            <NuxtLink :to="localePath('/account/profile')">{{ t('header.menu.profile') }}</NuxtLink>
            <button type="button" @click="handleLogout">{{ t('header.logout') }}</button>
          </template>
        </ClientOnly>
      </nav>
    </div>
  </header>
</template>
