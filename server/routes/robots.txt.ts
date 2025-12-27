export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const siteConfig = config.public.siteConfig
  const baseUrl = siteConfig.url

  const robotsContent = `User-Agent: *
Allow: /
Disallow: /account/
Disallow: /login
Disallow: /register
Disallow: /forgot-password
Disallow: /choose-role

Sitemap: ${baseUrl}/sitemap.xml
`

  event.node.res.setHeader('Content-Type', 'text/plain')
  return robotsContent
})

