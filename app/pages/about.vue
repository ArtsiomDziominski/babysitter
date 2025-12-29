<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <UContainer>
      <div class="max-w-4xl mx-auto">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            {{ $t('about.title') }}
          </h1>

          <div class="prose prose-gray dark:prose-invert max-w-none">
            <section class="mb-8">
              <p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed text-lg">
                {{ $t('about.intro') }}
              </p>
            </section>

            <section class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {{ $t('about.mission.title') }}
              </h2>
              <p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                {{ $t('about.mission.description') }}
              </p>
            </section>

            <section class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {{ $t('about.values.title') }}
              </h2>
              <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2 ml-4">
                <li v-for="(value, index) in values" :key="index">
                  <strong>{{ $t(`about.values.items.${value}.title`) }}</strong>
                  <span class="ml-2">{{ $t(`about.values.items.${value}.description`) }}</span>
                </li>
              </ul>
            </section>

            <section class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {{ $t('about.howItWorks.title') }}
              </h2>
              <p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                {{ $t('about.howItWorks.description') }}
              </p>
            </section>

            <section class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {{ $t('about.safety.title') }}
              </h2>
              <p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                {{ $t('about.safety.description') }}
              </p>
            </section>

            <section class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {{ $t('about.contact.title') }}
              </h2>
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mt-4">
                <p class="text-gray-700 dark:text-gray-300">
                  <strong>{{ $t('about.contact.email') }}:</strong> info@sitter.ge
                </p>
              </div>
            </section>
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

const values = ['safety', 'trust', 'convenience', 'quality']

useSeoMeta({
  title: () => t('seo.about.title'),
  description: () => t('seo.about.description'),
  ogTitle: () => t('seo.about.title'),
  ogDescription: () => t('seo.about.description'),
  ogImage: `${siteConfig.url}${siteConfig.logo}`,
  ogUrl: currentUrl,
  ogType: 'website',
  ogLocale: locale.value,
  twitterCard: 'summary_large_image',
  twitterTitle: () => t('seo.about.title'),
  twitterDescription: () => t('seo.about.description'),
  twitterImage: `${siteConfig.url}${siteConfig.logo}`
})

useHead({
  link: [
    { rel: 'canonical', href: currentUrl }
  ]
})
</script>

