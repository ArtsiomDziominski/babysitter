<template>
  <footer class="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
    <UContainer>
      <div class="py-12 max-xl:py-6 space-y-8 max-xl:space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-xl:gap-6">
          <div>
            <NuxtLink to="/" class="flex items-center gap-2 text-xl max-xl:text-lg font-semibold text-gray-900 dark:text-white mb-4 max-xl:mb-3">
              <img :src="siteConfig.logo" :alt="siteConfig.name" class="w-10 h-10 max-xl:w-8 max-xl:h-8 object-contain"/>
              <span>{{ siteConfig.name }}</span>
            </NuxtLink>
            <p class="text-sm max-xl:text-xs text-gray-600 dark:text-gray-400 mb-4 max-xl:mb-3">
              {{ $t('footer.description') }}
            </p>
            <div class="flex gap-4 max-xl:gap-3">
              <a href="#" class="text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors">
                <Icon name="mdi:instagram" size="24"/>
              </a>
              <a href="#" class="text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors">
                <Icon name="mdi:facebook" size="24"/>
              </a>
              <a href="#" class="text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors">
                <Icon name="mdi:telegram" size="24"/>
              </a>
            </div>
          </div>

          <div>
            <h3 class="font-semibold max-xl:text-sm text-gray-900 dark:text-white mb-4 max-xl:mb-3">
              {{ $t('footer.services.title') }}
            </h3>
            <ul class="space-y-2 max-xl:space-y-1.5">
              <li v-for="link in serviceLinks" :key="link.to">
                <NuxtLink :to="link.to"
                          class="text-sm max-xl:text-xs text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors">
                  {{ $t(link.label) }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <div>
            <h3 class="font-semibold max-xl:text-sm text-gray-900 dark:text-white mb-4 max-xl:mb-3">
              {{ $t('footer.info.title') }}
            </h3>
            <ul class="space-y-2 max-xl:space-y-1.5">
              <li v-for="link in infoLinks" :key="link.to">
                <NuxtLink :to="link.to"
                          class="text-sm max-xl:text-xs text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors">
                  {{ $t(link.label) }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!--          <div>-->
          <!--            <h3 class="font-semibold text-gray-900 dark:text-white mb-4">-->
          <!--              {{ $t('footer.contact.title') }}-->
          <!--            </h3>-->
          <!--            <ul class="space-y-3">-->
          <!--              <li>-->
          <!--                <a href="tel:+375291234567" class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors">-->
          <!--                  <Icon name="mdi:phone" size="20"/>-->
          <!--                  <span>+375 (29) 123-45-67</span>-->
          <!--                </a>-->
          <!--              </li>-->
          <!--              <li>-->
          <!--                <a href="mailto:info@babysitter.by" class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors">-->
          <!--                  <Icon name="mdi:email" size="20"/>-->
          <!--                  <span>info@babysitter.by</span>-->
          <!--                </a>-->
          <!--              </li>-->
          <!--              <li class="text-sm text-gray-600 dark:text-gray-400">-->
          <!--                {{ $t('footer.contact.hours') }}-->
          <!--              </li>-->
          <!--            </ul>-->
          <!--          </div>-->
        </div>

        <div class="pt-8 max-xl:pt-4 border-t border-gray-200 dark:border-gray-800">
          <div class="flex flex-col md:flex-row justify-between items-center gap-4 max-xl:gap-3">
            <div class="flex flex-wrap gap-4 max-xl:gap-2 text-sm max-xl:text-xs text-gray-600 dark:text-gray-400">
              <NuxtLink v-for="link in legalLinks" :key="link.to" :to="link.to"
                        class="hover:text-primary-500 transition-colors">
                {{ $t(link.label) }}
              </NuxtLink>
            </div>
            <div class="text-sm max-xl:text-xs text-gray-600 dark:text-gray-400">
              © {{ currentYear }}, Babysitter
            </div>
          </div>
        </div>
      </div>
    </UContainer>
  </footer>
</template>

<script setup lang="ts">
const siteConfig = useSiteConfig()
const { locale } = useI18n()
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
  { to: '/online-classes', label: 'footer.services.onlineClasses' },
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
</script>

