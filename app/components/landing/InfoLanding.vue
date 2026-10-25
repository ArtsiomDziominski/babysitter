<template>
  <div class="min-h-screen bg-muted dark:bg-default py-8">
    <UContainer>
      <div class="max-w-4xl mx-auto">
        <div class="bg-default rounded-lg shadow-sm p-8">
          <h1 class="text-3xl font-bold text-highlighted mb-6">
            {{ $t(`${i18nPrefix}.title`) }}
          </h1>

          <div class="prose prose-gray dark:prose-invert max-w-none">
            <section class="mb-8">
              <p class="text-default mb-4 leading-relaxed text-lg">
                {{ $t(`${i18nPrefix}.intro`) }}
              </p>
            </section>

            <section class="mb-8">
              <h2 class="text-2xl font-semibold text-highlighted mb-4">
                {{ $t(`${i18nPrefix}.stepsTitle`) }}
              </h2>
              <div class="space-y-6">
                <div v-for="(step, index) in steps" :key="index" class="flex gap-4">
                  <div class="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                    {{ index + 1 }}
                  </div>
                  <div>
                    <h3 class="font-semibold text-highlighted mb-1">
                      {{ step.name }}
                    </h3>
                    <p class="text-default">
                      {{ step.text }}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section v-for="list in renderedLists" :key="list.name" class="mb-8">
              <h2 class="text-2xl font-semibold text-highlighted mb-4">
                {{ $t(`${i18nPrefix}.${list.name}Title`) }}
              </h2>
              <ul class="list-disc list-inside text-default mb-4 space-y-2 ml-4">
                <li v-for="(item, index) in list.items" :key="index">
                  {{ item }}
                </li>
              </ul>
            </section>

            <section class="mb-8">
              <div class="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-6 text-center">
                <h3 class="text-xl font-semibold text-highlighted mb-4">
                  {{ $t(`${i18nPrefix}.ctaTitle`) }}
                </h3>
                <UButton :to="ctaTo" color="primary" size="lg">
                  {{ $t(`${i18nPrefix}.ctaButton`) }}
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
/**
 * Общий шаблон SEO-страниц «как найти бебиситтера в <городе>» и «как стать бебиситтером».
 * Тексты берутся из i18n по префиксу: title, intro, stepsTitle, steps.step1..4, ctaTitle, ctaButton
 * и списки `<name>` + `<name>Title`.
 */
const props = defineProps<{
  i18nPrefix: string
  lists: string[]
  ctaTo: string
  // Статья с разметкой HowTo и датами публикации (используется для основных страниц)
  article?: boolean
}>()

const STEPS_COUNT = 4

const { locale, t } = useI18n()
const route = useRoute()
const siteConfig = useSiteConfig()
const { getHowToSchema, addStructuredData } = useStructuredData()

const steps = computed(() =>
  Array.from({ length: STEPS_COUNT }, (_, index) => ({
    name: t(`${props.i18nPrefix}.steps.step${index + 1}.name`),
    text: t(`${props.i18nPrefix}.steps.step${index + 1}.text`)
  }))
)

const listItems = props.lists.map(name => ({
  name,
  items: useI18nList(() => `${props.i18nPrefix}.${name}`)
}))
const renderedLists = computed(() => listItems.map(list => ({ name: list.name, items: list.items.value })))

const currentUrl = `${siteConfig.url}${route.path}`
const pageTitle = t(`${props.i18nPrefix}.title`)
const pageDescription = t(`${props.i18nPrefix}.intro`)

if (props.article) {
  addStructuredData(getHowToSchema({
    name: pageTitle,
    description: pageDescription,
    steps: steps.value
  }))
}

useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  ogTitle: pageTitle,
  ogDescription: pageDescription,
  ogImage: `${siteConfig.url}${siteConfig.logo}`,
  ogUrl: currentUrl,
  ogType: props.article ? 'article' : 'website',
  ogLocale: locale.value,
  ...(props.article
    ? {
        articlePublishedTime: '2024-01-01T00:00:00Z',
        articleModifiedTime: new Date().toISOString()
      }
    : {}),
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
