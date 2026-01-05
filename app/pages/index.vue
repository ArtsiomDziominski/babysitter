<template>
  <div class="min-h-screen">
    <PageMainHeroSection />
    <!-- <PageMainStatsSection /> -->
    <PageMainHowItWorksSection />
    <PageMainBabysitterCanSection />
    <PageMainAdvantagesSection />
    <!-- <PageMainImageGallerySection /> -->
    <!-- <PageMainReviewsSection /> -->
    <PageMainBlogSection />
    <PageMainCTASection />
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useI18n()
const route = useRoute()
const siteConfig = useSiteConfig()

const currentUrl = `${siteConfig.url}${route.path}`

useSeoMeta({
  title: () => t('seo.home.title'),
  description: () => t('seo.home.description'),
  ogTitle: () => t('seo.home.title'),
  ogDescription: () => t('seo.home.description'),
  ogImage: `${siteConfig.url}${siteConfig.logo}`,
  ogUrl: currentUrl,
  ogType: 'website',
  ogLocale: locale.value,
  twitterCard: 'summary_large_image',
  twitterTitle: () => t('seo.home.title'),
  twitterDescription: () => t('seo.home.description'),
  twitterImage: `${siteConfig.url}${siteConfig.logo}`
})

useHead({
  link: [
    { rel: 'canonical', href: currentUrl }
  ]
})
</script>