<template>
  <div class="flex-1">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 max-xl:p-4">
      <h1 class="text-2xl max-xl:text-xl font-bold text-gray-900 dark:text-white mb-8 max-xl:mb-4">
        {{ $t('account.security.title') }}
      </h1>

      <div class="space-y-8 max-xl:space-y-6">
        <PageAccountChangeEmailForm />
        <PageAccountChangePasswordForm />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useI18n()
const route = useRoute()
const siteConfig = useSiteConfig()

definePageMeta({
  middleware: 'auth'
})

const currentUrl = `${siteConfig.url}${route.path}`

useSeoMeta({
  title: () => t('account.security.title'),
  description: () => t('account.security.title'),
  ogTitle: () => t('account.security.title'),
  ogDescription: () => t('account.security.title'),
  ogImage: `${siteConfig.url}${siteConfig.logo}`,
  ogUrl: currentUrl,
  ogType: 'website',
  ogLocale: locale.value,
  twitterCard: 'summary_large_image',
  twitterTitle: () => t('account.security.title'),
  twitterDescription: () => t('account.security.title'),
  twitterImage: `${siteConfig.url}${siteConfig.logo}`,
  robots: 'noindex, nofollow'
})

useHead({
  link: [
    { rel: 'canonical', href: currentUrl }
  ]
})
</script>

