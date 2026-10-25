<template>
  <UFooter class="border-t border-default bg-muted/40" :ui="{ top: 'border-b border-default' }">
    <template #top>
      <UContainer>
        <UFooterColumns :columns="columns">
          <template #left>
            <NuxtLink to="/" class="inline-flex items-center gap-2 text-lg font-semibold text-highlighted">
              <img :src="siteConfig.logo" :alt="siteConfig.name" class="size-9 rounded-md object-contain"/>
              <span>{{ siteConfig.name }}</span>
            </NuxtLink>
            <p class="mt-4 max-w-xs text-sm text-muted">
              {{ $t('footer.description') }}
            </p>
          </template>
        </UFooterColumns>
      </UContainer>
    </template>

    <template #left>
      <p class="text-sm text-muted">© {{ currentYear }}, Sitter</p>
    </template>

    <UNavigationMenu :items="legalItems" variant="link" :ui="{ list: 'flex-wrap justify-center' }" />

    <template #right>
      <UButton
          v-for="social in socials"
          :key="social.icon"
          :icon="social.icon"
          :to="social.to"
          :aria-label="social.label"
          color="neutral"
          variant="ghost"
      />
    </template>
  </UFooter>
</template>

<script setup lang="ts">
const siteConfig = useSiteConfig()
const { locale, t } = useI18n()
const currentYear = new Date().getFullYear()

const localizedBecomeSitterUrls: Record<string, string> = {
  ru: '/kak-stat-bebisitterom',
  en: '/how-to-become-babysitter',
  uk: '/yak-staty-bebisiterom',
  be: '/yak-stats-bebisiteram',
  ka: '/rogor-gavides-bebisiteri'
}

const becomeSitterUrl = computed(() => localizedBecomeSitterUrls[locale.value] || localizedBecomeSitterUrls.ru)

const serviceLinks = computed(() => [
  { to: '/search', label: 'footer.services.findSitter' },
  { to: becomeSitterUrl.value, label: 'footer.services.becomeSitter' }
])

const infoLinks = [
  { to: '/about', label: 'footer.info.about' },
  { to: '/faq', label: 'footer.info.faq' },
  { to: '/blog', label: 'footer.info.blog' },
  { to: '/help', label: 'footer.info.help' }
]

const socials = [
  { icon: 'i-mdi-instagram', to: '#', label: 'Instagram' },
  { icon: 'i-mdi-facebook', to: '#', label: 'Facebook' },
  { icon: 'i-mdi-telegram', to: '#', label: 'Telegram' }
]

const columns = computed(() => [
  {
    label: t('footer.services.title'),
    children: serviceLinks.value.map(link => ({ label: t(link.label), to: link.to }))
  },
  {
    label: t('footer.info.title'),
    children: infoLinks.map(link => ({ label: t(link.label), to: link.to }))
  }
])

const legalLinks = [
  { to: '/privacy', label: 'footer.legal.privacy' },
  { to: '/terms', label: 'footer.legal.terms' },
  { to: '/cookies', label: 'footer.legal.cookies' },
  { to: '/public-offer', label: 'footer.legal.offer' }
]

const legalItems = computed(() => legalLinks.map(link => ({ label: t(link.label), to: link.to })))
</script>

