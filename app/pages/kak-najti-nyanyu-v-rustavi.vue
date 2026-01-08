<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <UContainer>
      <div class="max-w-4xl mx-auto">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            {{ $t('pages.findNanny.rustavi.title') }}
          </h1>

          <div class="prose prose-gray dark:prose-invert max-w-none">
            <section class="mb-8">
              <p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed text-lg">
                {{ $t('pages.findNanny.rustavi.intro') }}
              </p>
            </section>

            <section class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {{ $t('pages.findNanny.rustavi.stepsTitle') }}
              </h2>
              <div class="space-y-6">
                <div class="flex gap-4">
                  <div class="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-semibold">
                    1
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                      {{ $t('pages.findNanny.rustavi.steps.step1.name') }}
                    </h3>
                    <p class="text-gray-700 dark:text-gray-300">
                      {{ $t('pages.findNanny.rustavi.steps.step1.text') }}
                    </p>
                  </div>
                </div>
                <div class="flex gap-4">
                  <div class="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-semibold">
                    2
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                      {{ $t('pages.findNanny.rustavi.steps.step2.name') }}
                    </h3>
                    <p class="text-gray-700 dark:text-gray-300">
                      {{ $t('pages.findNanny.rustavi.steps.step2.text') }}
                    </p>
                  </div>
                </div>
                <div class="flex gap-4">
                  <div class="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-semibold">
                    3
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                      {{ $t('pages.findNanny.rustavi.steps.step3.name') }}
                    </h3>
                    <p class="text-gray-700 dark:text-gray-300">
                      {{ $t('pages.findNanny.rustavi.steps.step3.text') }}
                    </p>
                  </div>
                </div>
                <div class="flex gap-4">
                  <div class="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-semibold">
                    4
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                      {{ $t('pages.findNanny.rustavi.steps.step4.name') }}
                    </h3>
                    <p class="text-gray-700 dark:text-gray-300">
                      {{ $t('pages.findNanny.rustavi.steps.step4.text') }}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {{ $t('pages.findNanny.rustavi.considerationsTitle') }}
              </h2>
              <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2 ml-4">
                <li v-for="(consideration, index) in considerations" :key="index">
                  {{ consideration }}
                </li>
              </ul>
            </section>

            <section class="mb-8">
              <div class="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-6 text-center">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {{ $t('pages.findNanny.rustavi.ctaTitle') }}
                </h3>
                <UButton to="/search?city=rustavi" color="primary" size="lg">
                  {{ $t('pages.findNanny.rustavi.ctaButton') }}
                </UButton>
              </div>
            </section>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  pageTransition: false
})

const { locale, t } = useI18n()
const route = useRoute()
const siteConfig = useSiteConfig()

const currentUrl = `${siteConfig.url}${route.path}`

const pageTitle = t('pages.findNanny.rustavi.title')
const pageDescription = t('pages.findNanny.rustavi.intro')

const considerations = computed(() => {
  try {
    const { $i18n } = useNuxtApp()
    const i18nInstance = $i18n as any
    const messages = i18nInstance.localeMessages?.value?.[locale.value] || 
                     i18nInstance.messages?.value?.[locale.value]
    
    if (messages?.pages?.findNanny?.rustavi?.considerations) {
      const value = messages.pages.findNanny.rustavi.considerations
      if (Array.isArray(value)) {
        if (value.length > 0 && typeof value[0] === 'string') {
          return value
        }
        return value.map((_, index) => {
          const key = `pages.findNanny.rustavi.considerations.${index}`
          const translated = t(key)
          return translated !== key ? translated : String(value[index])
        })
      }
    }
    return []
  } catch (e) {
    return []
  }
})

useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  ogTitle: pageTitle,
  ogDescription: pageDescription,
  ogImage: `${siteConfig.url}${siteConfig.logo}`,
  ogUrl: currentUrl,
  ogType: 'website',
  ogLocale: locale.value,
  twitterCard: 'summary_large_image',
  twitterTitle: pageTitle,
  twitterDescription: pageDescription,
  twitterImage: `${siteConfig.url}${siteConfig.logo}`
})

useHead({
  link: [
    { rel: 'canonical', href: currentUrl }
  ]
})
</script>

