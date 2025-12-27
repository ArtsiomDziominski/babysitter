export const useHreflang = () => {
  const { locale, locales } = useI18n()
  const route = useRoute()
  const siteConfig = useSiteConfig()

  const getHreflangLinks = () => {
    return locales.value.map((loc: any) => ({
      rel: 'alternate',
      hreflang: loc.iso || loc.code,
      href: `${siteConfig.url}${route.path}?lang=${loc.code}`
    }))
  }

  return {
    getHreflangLinks
  }
}

