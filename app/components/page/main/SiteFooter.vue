<script setup lang="ts">
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

const legalLinks = [
  { to: '/privacy', label: 'footer.legal.privacy' },
  { to: '/terms', label: 'footer.legal.terms' },
  { to: '/cookies', label: 'footer.legal.cookies' },
  { to: '/public-offer', label: 'footer.legal.offer' }
]

const socials = [
  { icon: 'i-mdi-instagram', to: '#', label: 'Instagram' },
  { icon: 'i-mdi-facebook', to: '#', label: 'Facebook' },
  { icon: 'i-mdi-telegram', to: '#', label: 'Telegram' }
]
</script>

<template>
  <footer class="site-footer">
    <div class="ftr">
      <div class="wrap">
        <div class="fgrid">
          <div>
            <NuxtLink to="/" class="brand" aria-label="Sitter.ge">
              <svg viewBox="0 0 64 64" aria-hidden="true">
                <rect width="64" height="64" rx="18" fill="#E8573A" />
                <path fill="none" stroke="#fff" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" d="M14 29 32 15l18 14" />
                <path fill="#fff" d="M32 51c-8.4-5.6-12.5-10.2-12.5-15.3 0-3.7 2.9-6.6 6.4-6.6 2.6 0 4.8 1.4 6.1 3.6 1.3-2.2 3.5-3.6 6.1-3.6 3.5 0 6.4 2.9 6.4 6.6 0 5.1-4.1 9.7-12.5 15.3Z" />
              </svg>
              <span>Sitter<span class="ge">.ge</span></span>
            </NuxtLink>
            <p class="tag">{{ t('footer.description') }}</p>
            <div class="soc">
              <a v-for="social in socials" :key="social.label" :href="social.to" :aria-label="social.label"><UIcon :name="social.icon" /></a>
            </div>
          </div>
          <div>
            <h4>{{ t('footer.services.title') }}</h4>
            <ul>
              <li v-for="link in serviceLinks" :key="link.to"><NuxtLink :to="link.to">{{ t(link.label) }}</NuxtLink></li>
            </ul>
          </div>
          <div>
            <h4>{{ t('footer.info.title') }}</h4>
            <ul>
              <li v-for="link in infoLinks" :key="link.to"><NuxtLink :to="link.to">{{ t(link.label) }}</NuxtLink></li>
            </ul>
          </div>
          <div class="app">
            <h4>{{ t('footer.parents.title') }}</h4>
            <p style="color:var(--ink-2);font-size:15px;margin:-6px 0 6px">{{ t('footer.parents.text') }}</p>
            <NuxtLink to="/blog" class="btn btn-ink">{{ t('footer.parents.cta') }} <UIcon name="i-lucide-arrow-right" class="ico arr" /></NuxtLink>
          </div>
        </div>
        <div class="mega" aria-hidden="true"><span>Sitter</span><span class="ge">.ge</span></div>
        <div class="fbot">
          <span>© {{ currentYear }}, Sitter</span>
          <nav :aria-label="t('footer.legalLabel')">
            <NuxtLink v-for="link in legalLinks" :key="link.to" :to="link.to">{{ t(link.label) }}</NuxtLink>
          </nav>
        </div>
      </div>
    </div>
  </footer>
</template>
