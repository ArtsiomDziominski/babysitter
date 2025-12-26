export const useSiteConfig = () => {
  const config = useRuntimeConfig()
  
  return config.public.siteConfig as {
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
  }
}

