function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const siteConfig = config.public.siteConfig
  const baseUrl = siteConfig.url
  const apiBaseUrl = config.public.apiBaseUrl

  const publicPages = [
    { path: '/', priority: '1.0', changefreq: 'daily' },
    { path: '/search', priority: '0.9', changefreq: 'daily' },
    { path: '/about', priority: '0.7', changefreq: 'monthly' },
    { path: '/faq', priority: '0.7', changefreq: 'monthly' },
    { path: '/help', priority: '0.7', changefreq: 'monthly' },
    { path: '/blog', priority: '0.8', changefreq: 'weekly' },
    { path: '/privacy', priority: '0.5', changefreq: 'yearly' },
    { path: '/terms', priority: '0.5', changefreq: 'yearly' },
    { path: '/cookies', priority: '0.5', changefreq: 'yearly' },
    { path: '/public-offer', priority: '0.5', changefreq: 'yearly' },
    { path: '/kak-stat-bebisitterom', priority: '0.8', changefreq: 'monthly' },
    { path: '/how-to-become-babysitter', priority: '0.8', changefreq: 'monthly' },
    { path: '/yak-staty-bebisiterom', priority: '0.8', changefreq: 'monthly' },
    { path: '/yak-stats-bebisiteram', priority: '0.8', changefreq: 'monthly' },
    { path: '/rogor-gavides-bebisiteri', priority: '0.8', changefreq: 'monthly' },
    { path: '/kak-najti-bebisittera-v-tbilisi', priority: '0.9', changefreq: 'weekly' },
    { path: '/kak-najti-bebisittera-v-batumi', priority: '0.9', changefreq: 'weekly' },
    { path: '/kak-najti-bebisittera-v-kutaisi', priority: '0.9', changefreq: 'weekly' },
    { path: '/kak-najti-bebisittera-v-rustavi', priority: '0.9', changefreq: 'weekly' },
    { path: '/kak-najti-bebisittera-v-gori', priority: '0.9', changefreq: 'weekly' },
    { path: '/kak-najti-bebisittera-v-poti', priority: '0.9', changefreq: 'weekly' },
    { path: '/kak-najti-nyanyu-v-tbilisi', priority: '0.9', changefreq: 'weekly' },
    { path: '/kak-najti-nyanyu-v-batumi', priority: '0.9', changefreq: 'weekly' },
    { path: '/kak-najti-nyanyu-v-kutaisi', priority: '0.9', changefreq: 'weekly' },
    { path: '/kak-najti-nyanyu-v-rustavi', priority: '0.9', changefreq: 'weekly' },
    { path: '/kak-najti-nyanyu-v-gori', priority: '0.9', changefreq: 'weekly' },
    { path: '/kak-najti-nyanyu-v-poti', priority: '0.9', changefreq: 'weekly' }
  ]

  const sitterPages: Array<{ path: string; lastmod?: string }> = []
  const blogPages: Array<{ path: string; lastmod?: string }> = []

  try {
    let page = 1
    let hasMore = true
    const limit = 100

    while (hasMore) {
      const response = await fetch(`${apiBaseUrl}/babysitters?page=${page}&limit=${limit}`)
      if (!response.ok) break

      const data = await response.json()
      const sitters = data?.data?.data || []

      if (sitters.length === 0) {
        hasMore = false
        break
      }

      for (const sitter of sitters) {
        if (sitter.showInSearch && sitter.id) {
          sitterPages.push({
            path: `/sitter/${sitter.id}`,
            lastmod: sitter.updatedAt ? new Date(sitter.updatedAt).toISOString().split('T')[0] : undefined
          })
        }
      }

      const totalPages = data?.data?.meta?.totalPages || 1
      if (page >= totalPages) {
        hasMore = false
      } else {
        page++
      }
    }
  } catch (error) {
    console.error('Error loading sitters for sitemap:', error)
  }

  try {
    const strapiUrl = config.strapiUrl
    const strapiApiToken = config.strapiApiToken
    let page = 1
    let hasMore = true
    const limit = 100

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (strapiApiToken) {
      headers['Authorization'] = `Bearer ${strapiApiToken}`
    }

    while (hasMore) {
      const queryParams = new URLSearchParams()
      queryParams.append('populate', '*')
      queryParams.append('pagination[page]', page.toString())
      queryParams.append('pagination[pageSize]', limit.toString())
      queryParams.append('sort', 'publishedAt:desc')

      const response = await fetch(`${strapiUrl}/api/articles?${queryParams.toString()}`, {
        headers,
      })

      if (!response.ok) break

      const data = await response.json()
      const articles = data?.data || []

      if (articles.length === 0) {
        hasMore = false
        break
      }

      for (const article of articles) {
        if (article.slug && article.publishedAt) {
          blogPages.push({
            path: `/blog/${article.slug}`,
            lastmod: article.updatedAt 
              ? new Date(article.updatedAt).toISOString().split('T')[0] 
              : new Date(article.publishedAt).toISOString().split('T')[0]
          })
        }
      }

      const totalPages = data?.meta?.pagination?.pageCount || 1
      if (page >= totalPages) {
        hasMore = false
      } else {
        page++
      }
    }
  } catch (error) {
    console.error('Error loading blog articles for sitemap:', error)
  }

  const locales = (siteConfig.locales as Array<{ code: string; iso?: string }>).filter((loc) => loc.code)
  const defaultLocale = siteConfig.defaultLocale as string
  const lastmod = new Date().toISOString().split('T')[0]

  // Адрес страницы в конкретной локали: /ru, /ru/search, /en/blog/slug
  const localizedUrl = (path: string, code: string) => `${baseUrl}/${code}${path === '/' ? '' : path}`

  // Каждая страница попадает в sitemap в каждой локали,
  // и у каждой записи есть hreflang-ссылки на все языковые версии + x-default
  const renderUrls = (path: string, pageLastmod: string, changefreq: string, priority: string) => {
    const alternates = locales
      .map((locale) => `
    <xhtml:link rel="alternate" hreflang="${escapeXml(locale.iso || locale.code)}" href="${escapeXml(localizedUrl(path, locale.code))}" />`)
      .join('') + `
    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(localizedUrl(path, defaultLocale))}" />`

    return locales
      .map((locale) => `
  <url>
    <loc>${escapeXml(localizedUrl(path, locale.code))}</loc>
    <lastmod>${pageLastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${alternates}
  </url>`)
      .join('')
  }

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">`

  for (const page of publicPages) {
    sitemap += renderUrls(page.path, lastmod, page.changefreq, page.priority)
  }

  for (const sitterPage of sitterPages) {
    sitemap += renderUrls(sitterPage.path, sitterPage.lastmod || lastmod, 'weekly', '0.8')
  }

  for (const blogPage of blogPages) {
    sitemap += renderUrls(blogPage.path, blogPage.lastmod || lastmod, 'monthly', '0.7')
  }

  sitemap += `
</urlset>`

  event.node.res.setHeader('Content-Type', 'application/xml')
  return sitemap
})

