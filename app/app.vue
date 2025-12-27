<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <ConfirmModal />
  </UApp>
</template>

<script setup lang="ts">
const { locale, locales, defaultLocale, setLocale } = useI18n()
const route = useRoute()
const siteConfig = useSiteConfig()
const notifications = useNotifications()

const currentLocale = computed(() => {
  const current = locales.value.find((l: any) => l.code === locale.value)
  const localeString = current?.iso || current?.code || locale.value
  return typeof localeString === 'string' ? localeString : 'ka'
})

const hreflangLinks = computed(() => {
  const basePath = route.path
  const links = locales.value.map((loc: any) => ({
    rel: 'alternate',
    hreflang: loc.iso || loc.code,
    href: `${siteConfig.url}${basePath}?lang=${loc.code}`
  }))
  
  links.push({
    rel: 'alternate',
    hreflang: 'x-default',
    href: `${siteConfig.url}${basePath}?lang=${defaultLocale}`
  })
  
  return links
})

watch(() => route.query.lang, (langParam) => {
  if (langParam && typeof langParam === 'string') {
    const validLocale = locales.value.find((l: any) => l.code === langParam)
    if (validLocale && locale.value !== langParam) {
      setLocale(langParam as 'ka' | 'en' | 'ru' | 'uk')
    }
  }
}, { immediate: true })

useHead({
  htmlAttrs: {
    lang: currentLocale.value.split('-')[0]
  },
  link: hreflangLinks
})

onMounted(() => {
  notifications.init()
})
</script>