<script setup lang="ts">
const { t, locale } = useI18n()
const route = useRoute()
const siteConfig = useSiteConfig()

const currentUrl = `${siteConfig.url}${route.path}`

useSeoMeta({
  title: () => t('account.sections.profile'),
  description: () => t('account.sections.profile'),
  ogTitle: () => t('account.sections.profile'),
  ogDescription: () => t('account.sections.profile'),
  ogImage: `${siteConfig.url}${siteConfig.logo}`,
  ogUrl: currentUrl,
  ogType: 'website',
  ogLocale: locale.value,
  twitterCard: 'summary_large_image',
  twitterTitle: () => t('account.sections.profile'),
  twitterDescription: () => t('account.sections.profile'),
  twitterImage: `${siteConfig.url}${siteConfig.logo}`,
  robots: 'noindex, nofollow'
})

useHead({
  link: [
    { rel: 'canonical', href: currentUrl }
  ]
})
</script>

<template>
  <div class="flex gap-6">
    <ProfileSidebar />
    <NuxtPage />
  </div>
</template>

<style scoped>

</style>
