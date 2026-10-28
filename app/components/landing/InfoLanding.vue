<template>
  <div class="max-w-4xl mx-auto pb-16">
    <UPageHeader
      :title="$t(`${i18nPrefix}.title`)"
      :description="$t(`${i18nPrefix}.intro`)"
      :ui="{ description: 'text-lg' }"
    />

    <UPageBody class="space-y-12">
      <section>
        <h2 class="text-2xl font-semibold text-highlighted mb-6">
          {{ $t(`${i18nPrefix}.stepsTitle`) }}
        </h2>
        <ol class="grid gap-4 sm:grid-cols-2">
          <li v-for="(step, index) in steps" :key="index">
            <UPageCard :title="step.name" :description="step.text" class="h-full">
              <template #leading>
                <span class="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold ring-1 ring-inset ring-primary/20">
                  {{ index + 1 }}
                </span>
              </template>
            </UPageCard>
          </li>
        </ol>
      </section>

      <section v-for="list in renderedLists" :key="list.name">
        <h2 class="text-2xl font-semibold text-highlighted mb-6">
          {{ $t(`${i18nPrefix}.${list.name}Title`) }}
        </h2>
        <ul class="grid gap-3 sm:grid-cols-2">
          <li v-for="(item, index) in list.items" :key="index" class="flex gap-3 text-default">
            <UIcon name="i-lucide-circle-check" class="size-5 shrink-0 mt-0.5 text-primary" />
            <span>{{ item }}</span>
          </li>
        </ul>
      </section>

      <UPageCTA
        :title="$t(`${i18nPrefix}.ctaTitle`)"
        :links="[{ label: $t(`${i18nPrefix}.ctaButton`), to: localePath(ctaTo), size: 'lg', trailingIcon: 'i-lucide-arrow-right' }]"
        variant="soft"
        :ui="{ container: 'py-10 sm:py-12 lg:py-12', title: 'text-2xl sm:text-3xl' }"
      />
    </UPageBody>
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
const localePath = useLocalePath()
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
