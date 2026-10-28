export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const siteConfig = config.public.siteConfig
  const baseUrl = siteConfig.url

  const privatePaths = ['/account/', '/login', '/register', '/forgot-password', '/choose-role']
  const localeCodes = (siteConfig.locales as Array<{ code: string }>).map((l) => l.code)
  // Закрытые страницы есть в каждой локали: /ru/account/, /en/login и т.д.
  const disallow = localeCodes
    .flatMap((code) => privatePaths.map((path) => `Disallow: /${code}${path}`))
    .join('\n')

  const robotsContent = `User-Agent: *
Allow: /
${disallow}

Sitemap: ${baseUrl}/sitemap.xml
`

  event.node.res.setHeader('Content-Type', 'text/plain')
  return robotsContent
})

