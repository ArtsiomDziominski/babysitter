export const useSiteConfig = () => {
  const config = useRuntimeConfig()
  const { defaultLocale } = useI18n()
  
  return {
    ...config.public.siteConfig,
    defaultLocale: defaultLocale.value
  } as {
    name: string
    url: string
    logo: string
    description: string
    keywords: string[]
    author: string
    authorUrl: string
    authorEmail: string
    authorPhone: string
    authorAddress: string
    authorCity: string
    authorState: string
    authorZip: string
    currency: string
    defaultLocale: string
  }
}

