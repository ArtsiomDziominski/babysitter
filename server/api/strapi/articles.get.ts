export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const strapiUrl = config.strapiUrl
  const strapiApiToken = config.strapiApiToken
  const query = getQuery(event)

  const queryParams = new URLSearchParams()
  
  queryParams.append('populate', '*')
  
  if (query.page) {
    queryParams.append('pagination[page]', String(query.page))
  }
  if (query.limit) {
    queryParams.append('pagination[pageSize]', String(query.limit))
  }
  if (query.search) {
    queryParams.append('filters[$or][0][title][$containsi]', String(query.search))
    queryParams.append('filters[$or][1][excerpt][$containsi]', String(query.search))
    queryParams.append('filters[$or][2][content][$containsi]', String(query.search))
  }
  if (query.category) {
    queryParams.append('filters[categories][name][$eq]', String(query.category))
  }
  if (query.tag) {
    const tags = String(query.tag).split(',')
    tags.forEach((tag, index) => {
      queryParams.append(`filters[tags][name][$in][${index}]`, tag.trim())
    })
  }
  if (query.sort) {
    const sortField = query.sort === 'published' ? 'publishedAt' : String(query.sort)
    const sortOrder = query.order || 'desc'
    queryParams.append('sort', `${sortField}:${sortOrder}`)
  } else {
    queryParams.append('sort', 'publishedAt:desc')
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (strapiApiToken) {
    headers['Authorization'] = `Bearer ${strapiApiToken}`
  }

  let response: Response
  try {
    response = await fetch(`${strapiUrl}/api/articles?${queryParams.toString()}`, {
      headers,
    })
  } catch {
    // Keep homepage/blog widgets usable even when local Strapi is down.
    return {
      data: [],
      meta: {
        pagination: {
          page: Number(query.page || 1),
          pageSize: Number(query.limit || 10),
          pageCount: 0,
          total: 0
        }
      }
    }
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Ошибка загрузки данных' }))
    throw createError({
      statusCode: response.status,
      statusMessage: error.error?.message || 'Ошибка загрузки данных'
    })
  }

  return await response.json()
})

