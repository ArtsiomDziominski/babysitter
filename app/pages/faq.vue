<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <UContainer>
      <div class="max-w-4xl mx-auto">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {{ $t('faq.title') }}
          </h1>
          <p class="text-gray-600 dark:text-gray-400 mb-8">
            {{ $t('faq.subtitle') }}
          </p>

          <div class="space-y-4">
            <UAccordion :items="faqItems" :ui="{ wrapper: 'space-y-2' }" />
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useI18n()
const route = useRoute()
const siteConfig = useSiteConfig()

const currentUrl = `${siteConfig.url}${route.path}`

const faqItems = computed(() => [
  {
    label: t('faq.items.forParents.title'),
    defaultOpen: false,
    content: t('faq.items.forParents.content')
  },
  {
    label: t('faq.items.howToBook.title'),
    defaultOpen: false,
    content: t('faq.items.howToBook.content')
  },
  {
    label: t('faq.items.pricing.title'),
    defaultOpen: false,
    content: t('faq.items.pricing.content')
  },
  {
    label: t('faq.items.safety.title'),
    defaultOpen: false,
    content: t('faq.items.safety.content')
  },
  {
    label: t('faq.items.payment.title'),
    defaultOpen: false,
    content: t('faq.items.payment.content')
  },
  {
    label: t('faq.items.cancellation.title'),
    defaultOpen: false,
    content: t('faq.items.cancellation.content')
  },
  {
    label: t('faq.items.becomeSitter.title'),
    defaultOpen: false,
    content: t('faq.items.becomeSitter.content')
  },
  {
    label: t('faq.items.support.title'),
    defaultOpen: false,
    content: t('faq.items.support.content')
  }
])

useSeoMeta({
  title: () => t('seo.faq.title'),
  description: () => t('seo.faq.description'),
  ogTitle: () => t('seo.faq.title'),
  ogDescription: () => t('seo.faq.description'),
  ogImage: `${siteConfig.url}${siteConfig.logo}`,
  ogUrl: currentUrl,
  ogType: 'website',
  ogLocale: locale.value,
  twitterCard: 'summary_large_image',
  twitterTitle: () => t('seo.faq.title'),
  twitterDescription: () => t('seo.faq.description'),
  twitterImage: `${siteConfig.url}${siteConfig.logo}`
})

useHead({
  link: [
    { rel: 'canonical', href: currentUrl }
  ]
})
</script>

