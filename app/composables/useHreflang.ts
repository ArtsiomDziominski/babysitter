export const useHreflang = () => {
  const { locale, locales } = useI18n()
  const route = useRoute()
  const siteConfig = useSiteConfig()

  const getHreflangLinks = () => {
    const basePath = route.path
    const links = locales.value.map((loc: any) => ({
      rel: 'alternate',
      hreflang: loc.iso || loc.code,
      href: `${siteConfig.url}${basePath}?lang=${loc.code}`
    }))
    
    links.push({
      rel: 'alternate',
      hreflang: 'x-default',
      href: `${siteConfig.url}${basePath}?lang=${siteConfig.defaultLocale || 'ka'}`
    })
    
    return links
  }

  return {
    getHreflangLinks
  }
}

