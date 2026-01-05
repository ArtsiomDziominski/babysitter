export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('prerender:routes', async (ctx) => {
    const config = useRuntimeConfig()
    const strapiUrl = config.strapiUrl
    const strapiApiToken = config.strapiApiToken

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }

      if (strapiApiToken) {
        headers['Authorization'] = `Bearer ${strapiApiToken}`
      }

      let page = 1
      const limit = 100
      const allArticles: string[] = []

      while (true) {
        const response = await fetch(
          `${strapiUrl}/api/articles?populate=*&pagination[page]=${page}&pagination[pageSize]=${limit}&sort=publishedAt:desc`,
          { headers }
        )

        if (!response.ok) {
          console.warn('Не удалось загрузить статьи для пререндера')
          break
        }

        const data = await response.json()
        const articles = data.data || []

        if (articles.length === 0) {
          break
        }

        articles.forEach((article: any) => {
          const slug = article.attributes?.slug || article.slug
          if (slug) {
            allArticles.push(`/blog/${slug}`)
          }
        })

        const pagination = data.meta?.pagination
        if (!pagination || page >= pagination.pageCount) {
          break
        }

        page++
      }

      ctx.routes.push(...allArticles)
      console.log(`Добавлено ${allArticles.length} статей для пререндера`)
    } catch (error) {
      console.error('Ошибка при генерации маршрутов блога для пререндера:', error)
    }
  })
})

