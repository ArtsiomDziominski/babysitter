<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <UContainer>
      <div class="max-w-4xl mx-auto">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            {{ $t('help.title') }}
          </h1>

          <div class="prose prose-gray dark:prose-invert max-w-none">
            <section class="mb-8">
              <p class="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed text-lg">
                {{ $t('help.intro') }}
              </p>
            </section>

            <section class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {{ $t('help.gettingStarted.title') }}
              </h2>
              <div class="space-y-4">
                <div v-for="(step, index) in gettingStartedSteps" :key="index" class="flex gap-4">
                  <div class="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-semibold">
                    {{ index + 1 }}
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                      {{ $t(`help.gettingStarted.steps.${step}.title`) }}
                    </h3>
                    <p class="text-gray-700 dark:text-gray-300">
                      {{ $t(`help.gettingStarted.steps.${step}.description`) }}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {{ $t('help.commonIssues.title') }}
              </h2>
              <div class="space-y-4">
                <div v-for="issue in commonIssues" :key="issue" class="border-l-4 border-primary-500 pl-4">
                  <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                    {{ $t(`help.commonIssues.items.${issue}.title`) }}
                  </h3>
                  <p class="text-gray-700 dark:text-gray-300">
                    {{ $t(`help.commonIssues.items.${issue}.solution`) }}
                  </p>
                </div>
              </div>
            </section>

            <section class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {{ $t('help.contact.title') }}
              </h2>
              <p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                {{ $t('help.contact.description') }}
              </p>
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mt-4">
                <p class="text-gray-700 dark:text-gray-300 mb-2">
                  <strong>{{ $t('help.contact.email') }}:</strong> 
                  <a href="mailto:info@babysitter.by" class="text-primary-500 hover:text-primary-600">
                    info@babysitter.by
                  </a>
                </p>
              </div>
            </section>

            <section class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {{ $t('help.resources.title') }}
              </h2>
              <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2 ml-4">
                <li>
                  <NuxtLink to="/faq" class="text-primary-500 hover:text-primary-600">
                    {{ $t('footer.info.faq') }}
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/about" class="text-primary-500 hover:text-primary-600">
                    {{ $t('footer.info.about') }}
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/blog" class="text-primary-500 hover:text-primary-600">
                    {{ $t('footer.info.blog') }}
                  </NuxtLink>
                </li>
              </ul>
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

const gettingStartedSteps = ['register', 'search', 'book', 'communicate']
const commonIssues = ['forgotPassword', 'bookingIssues', 'paymentProblems', 'accountAccess']

useSeoMeta({
  title: () => t('seo.help.title'),
  description: () => t('seo.help.description'),
  ogTitle: () => t('seo.help.title'),
  ogDescription: () => t('seo.help.description'),
  ogImage: `${siteConfig.url}${siteConfig.logo}`,
  ogUrl: currentUrl,
  ogType: 'website',
  ogLocale: locale.value,
  twitterCard: 'summary_large_image',
  twitterTitle: () => t('seo.help.title'),
  twitterDescription: () => t('seo.help.description'),
  twitterImage: `${siteConfig.url}${siteConfig.logo}`
})

useHead({
  link: [
    { rel: 'canonical', href: currentUrl }
  ]
})
</script>

