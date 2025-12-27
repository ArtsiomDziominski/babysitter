export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const siteConfig = config.public.siteConfig
  const baseUrl = siteConfig.url

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

  const locales = (siteConfig.locales as Array<{ code: string; iso?: string }>).filter((loc) => loc.code)
  const lastmod = new Date().toISOString().split('T')[0]

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">`

  for (const page of publicPages) {
    sitemap += `
  <url>
    <loc>${baseUrl}${page.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>`

    for (const locale of locales) {
      sitemap += `
    <xhtml:link rel="alternate" hreflang="${locale.iso || locale.code}" href="${baseUrl}${page.path}?lang=${locale.code}" />`
    }

    sitemap += `
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}${page.path}?lang=${siteConfig.defaultLocale}" />`

    sitemap += `
  </url>`
  }

  sitemap += `
</urlset>`

  event.node.res.setHeader('Content-Type', 'application/xml')
  return sitemap
})

