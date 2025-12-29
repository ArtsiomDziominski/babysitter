<script setup lang="ts">
import { UserRole } from '~/const/roles'

const route = useRoute()
const authStore = useAuthStore()
const { t, locale } = useI18n()
const siteConfig = useSiteConfig()

const currentUrl = `${siteConfig.url}${route.path}`

useSeoMeta({
  title: () => t('account.sections.booking'),
  description: () => t('account.sections.booking'),
  ogTitle: () => t('account.sections.booking'),
  ogDescription: () => t('account.sections.booking'),
  ogImage: `${siteConfig.url}${siteConfig.logo}`,
  ogUrl: currentUrl,
  ogType: 'website',
  ogLocale: locale.value,
  twitterCard: 'summary_large_image',
  twitterTitle: () => t('account.sections.booking'),
  twitterDescription: () => t('account.sections.booking'),
  twitterImage: `${siteConfig.url}${siteConfig.logo}`,
  robots: 'noindex, nofollow'
})

useHead({
  link: [
    { rel: 'canonical', href: currentUrl }
  ]
})

const enum BookingSection {
  KIDS = 'kids',
  TRUSTED = 'trusted',
  NANNY = 'nanny',
}

definePageMeta({
  middleware: 'auth'
})

const isParent = computed(() => authStore.user.role === UserRole.PARENT)

const defaultPath = computed(() =>
    isParent.value ? '/account/booking/kids' : '/account/booking/babysitter'
)

watchEffect(() => {
  if (route.path === '/account/booking') {
    navigateTo(defaultPath.value, { replace: true })
  }
})

watchEffect(() => {
  if (!isParent.value && route.path.startsWith('/account/booking') && !route.path.includes('/account/booking/babysitter')) {
    navigateTo('/account/booking/babysitter', { replace: true })
  }
})

const menuItems = computed(() => {
  if (isParent.value) {
    return [
      {
        to: '/account/booking/kids',
        label: 'account.sections.kids',
        section: BookingSection.KIDS
      },
      {
        to: '/account/booking/trusted',
        label: 'account.booking.trustedPerson.title',
        section: BookingSection.TRUSTED
      }
    ]
  }

  return [
    {
      to: '/account/booking/babysitter',
      label: 'Профиль няни',
      section: BookingSection.NANNY
    }
  ]
})

const activeSection = computed(() => {
  if (isParent.value) {
    if (route.path.includes('/booking/kids')) return BookingSection.KIDS
    if (route.path.includes('/booking/trusted')) return BookingSection.TRUSTED
    return BookingSection.KIDS
  }

  if (route.path.includes('/booking/nanny') || route.path.includes('/booking/babysitter')) return BookingSection.NANNY
  return BookingSection.NANNY
})
</script>

<template>
  <div class="flex gap-6">
    <PageAccountSectionSidebar :items="menuItems" :active-section="activeSection" />
    <NuxtPage />
  </div>
</template>

