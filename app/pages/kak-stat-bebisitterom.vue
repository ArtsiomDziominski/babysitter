<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <UContainer>
      <div class="max-w-4xl mx-auto">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            {{ $t('pages.becomeBabysitter.title') }}
          </h1>

          <div class="prose prose-gray dark:prose-invert max-w-none">
            <section class="mb-8">
              <p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed text-lg">
                {{ $t('pages.becomeBabysitter.intro') }}
              </p>
            </section>

            <section class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {{ $t('pages.becomeBabysitter.stepsTitle') }}
              </h2>
              <div class="space-y-6">
                <div class="flex gap-4">
                  <div class="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-semibold">
                    1
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                      {{ $t('pages.becomeBabysitter.steps.step1.name') }}
                    </h3>
                    <p class="text-gray-700 dark:text-gray-300">
                      {{ $t('pages.becomeBabysitter.steps.step1.text') }}
                    </p>
                  </div>
                </div>
                <div class="flex gap-4">
                  <div class="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-semibold">
                    2
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                      {{ $t('pages.becomeBabysitter.steps.step2.name') }}
                    </h3>
                    <p class="text-gray-700 dark:text-gray-300">
                      {{ $t('pages.becomeBabysitter.steps.step2.text') }}
                    </p>
                  </div>
                </div>
                <div class="flex gap-4">
                  <div class="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-semibold">
                    3
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                      {{ $t('pages.becomeBabysitter.steps.step3.name') }}
                    </h3>
                    <p class="text-gray-700 dark:text-gray-300">
                      {{ $t('pages.becomeBabysitter.steps.step3.text') }}
                    </p>
                  </div>
                </div>
                <div class="flex gap-4">
                  <div class="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-semibold">
                    4
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                      {{ $t('pages.becomeBabysitter.steps.step4.name') }}
                    </h3>
                    <p class="text-gray-700 dark:text-gray-300">
                      {{ $t('pages.becomeBabysitter.steps.step4.text') }}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {{ $t('pages.becomeBabysitter.requirementsTitle') }}
              </h2>
              <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2 ml-4">
                <li v-for="(requirement, index) in requirements" :key="index">
                  {{ requirement }}
                </li>
              </ul>
            </section>

            <section class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {{ $t('pages.becomeBabysitter.benefitsTitle') }}
              </h2>
              <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2 ml-4">
                <li v-for="(benefit, index) in benefits" :key="index">
                  {{ benefit }}
                </li>
              </ul>
            </section>

            <section class="mb-8">
              <div class="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-6 text-center">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {{ $t('pages.becomeBabysitter.ctaTitle') }}
                </h3>
                <UButton to="/register" color="primary" size="lg">
                  {{ $t('pages.becomeBabysitter.ctaButton') }}
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
const { locale, t } = useI18n()
const route = useRoute()
const siteConfig = useSiteConfig()
const { getHowToSchema, addStructuredData } = useStructuredData()

const currentUrl = `${siteConfig.url}${route.path}`

const howToSchema = getHowToSchema({
  name: t('pages.becomeBabysitter.title'),
  description: t('pages.becomeBabysitter.intro'),
  steps: [
    {
      name: t('pages.becomeBabysitter.steps.step1.name'),
      text: t('pages.becomeBabysitter.steps.step1.text')
    },
    {
      name: t('pages.becomeBabysitter.steps.step2.name'),
      text: t('pages.becomeBabysitter.steps.step2.text')
    },
    {
      name: t('pages.becomeBabysitter.steps.step3.name'),
      text: t('pages.becomeBabysitter.steps.step3.text')
    },
    {
      name: t('pages.becomeBabysitter.steps.step4.name'),
      text: t('pages.becomeBabysitter.steps.step4.text')
    }
  ]
})

addStructuredData(howToSchema)

const publishedTime = '2024-01-01T00:00:00Z'
const modifiedTime = new Date().toISOString()

const pageTitle = t('pages.becomeBabysitter.title')
const pageDescription = t('pages.becomeBabysitter.intro')

const requirements = computed(() => {
  try {
    const { $i18n } = useNuxtApp()
    const i18nInstance = $i18n as any
    const messages = i18nInstance.localeMessages?.value?.[locale.value] || 
                     i18nInstance.messages?.value?.[locale.value]
    
    if (messages?.pages?.becomeBabysitter?.requirements) {
      const value = messages.pages.becomeBabysitter.requirements
      if (Array.isArray(value)) {
        if (value.length > 0 && typeof value[0] === 'string') {
          return value
        }
        return value.map((_, index) => {
          const key = `pages.becomeBabysitter.requirements.${index}`
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

const benefits = computed(() => {
  try {
    const { $i18n } = useNuxtApp()
    const i18nInstance = $i18n as any
    const messages = i18nInstance.localeMessages?.value?.[locale.value] || 
                     i18nInstance.messages?.value?.[locale.value]
    
    if (messages?.pages?.becomeBabysitter?.benefits) {
      const value = messages.pages.becomeBabysitter.benefits
      if (Array.isArray(value)) {
        if (value.length > 0 && typeof value[0] === 'string') {
          return value
        }
        return value.map((_, index) => {
          const key = `pages.becomeBabysitter.benefits.${index}`
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
  ogType: 'article',
  ogLocale: locale.value,
  articlePublishedTime: publishedTime,
  articleModifiedTime: modifiedTime,
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

