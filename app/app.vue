<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <ConfirmModal />
  </UApp>
</template>

<script setup lang="ts">
const { locale, locales } = useI18n()
const notifications = useNotifications()
const { getOrganizationSchema, addStructuredData } = useStructuredData()

const currentLocale = computed(() => {
  const current = locales.value.find((l: any) => l.code === locale.value)
  const localeString = current?.iso || current?.code || locale.value
  return typeof localeString === 'string' ? localeString : 'ka'
})

// hreflang-ссылки на ту же страницу в каждой локали (/ru/..., /en/...) + x-default.
// canonical страницы задают сами, поэтому i18n-canonical отсюда не берём
const localeHead = useLocaleHead({ seo: true })
const hreflangLinks = computed(() => (localeHead.value.link || []).filter((link: any) => link.hreflang))

addStructuredData(getOrganizationSchema())

useHead({
  htmlAttrs: {
    lang: () => currentLocale.value.split('-')[0]
  },
  link: hreflangLinks
})

onMounted(() => {
  notifications.init()
})
</script>