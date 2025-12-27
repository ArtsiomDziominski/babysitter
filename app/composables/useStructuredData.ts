export const useStructuredData = () => {
  const siteConfig = useSiteConfig()
  const route = useRoute()
  const { locale } = useI18n()

  const getOrganizationSchema = () => {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
      logo: `${siteConfig.url}${siteConfig.logo}`,
      description: siteConfig.description,
      contactPoint: {
        '@type': 'ContactPoint',
        email: siteConfig.authorEmail,
        contactType: 'customer service'
      },
      sameAs: siteConfig.authorUrl ? [siteConfig.authorUrl] : []
    }
  }

  const getServiceSchema = () => {
    return {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'Babysitting Service',
      provider: {
        '@type': 'Organization',
        name: siteConfig.name,
        url: siteConfig.url
      },
      areaServed: {
        '@type': 'Country',
        name: 'Georgia'
      },
      description: siteConfig.description
    }
  }

  const getHowToSchema = (data: {
    name: string
    description: string
    steps: Array<{ name: string; text: string }>
  }) => {
    return {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: data.name,
      description: data.description,
      step: data.steps.map((step, index) => ({
        '@type': 'HowToStep',
        position: index + 1,
        name: step.name,
        text: step.text
      }))
    }
  }

  const getArticleSchema = (data: {
    headline: string
    description: string
    image?: string
    datePublished?: string
    dateModified?: string
    author?: string
  }) => {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: data.headline,
      description: data.description,
      image: data.image || `${siteConfig.url}${siteConfig.logo}`,
      datePublished: data.datePublished || new Date().toISOString(),
      dateModified: data.dateModified || new Date().toISOString(),
      author: {
        '@type': 'Organization',
        name: data.author || siteConfig.name
      },
      publisher: {
        '@type': 'Organization',
        name: siteConfig.name,
        logo: {
          '@type': 'ImageObject',
          url: `${siteConfig.url}${siteConfig.logo}`
        }
      }
    }
  }

  const getBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url
      }))
    }
  }

  const addStructuredData = (schema: object) => {
    useHead({
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(schema)
        }
      ]
    })
  }

  return {
    getOrganizationSchema,
    getServiceSchema,
    getHowToSchema,
    getArticleSchema,
    getBreadcrumbSchema,
    addStructuredData
  }
}

