<template>
  <div class="max-w-3xl mx-auto py-10 lg:py-16">
          <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-highlighted mb-2">
            {{ $t('faq.title') }}
          </h1>
          <p class="text-toned mb-8">
            {{ $t('faq.subtitle') }}
          </p>

          <div class="space-y-4">
            <UAccordion :items="faqItems" />
          </div>
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

