export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const strapiUrl = config.strapiUrl
  const strapiApiToken = config.strapiApiToken
  
  const param = event.context.params?.slug || event.context.params?.id
  
  if (!param) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Параметр обязателен'
    })
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (strapiApiToken) {
    headers['Authorization'] = `Bearer ${strapiApiToken}`
  }

  const isNumericId = /^\d+$/.test(param)

  let response: Response
  let data: any

  if (isNumericId) {
    const queryParams = new URLSearchParams()
    queryParams.append('populate', '*')
    
    response = await fetch(`${strapiUrl}/api/articles/${param}?${queryParams.toString()}`, {
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Ошибка загрузки данных' }))
      throw createError({
        statusCode: response.status,
        statusMessage: error.error?.message || 'Ошибка загрузки данных'
      })
    }

    data = await response.json()
    return { data: data.data, meta: data.meta }
  } else {
    const queryParams = new URLSearchParams()
    queryParams.append('filters[slug][$eq]', param)
    queryParams.append('populate', '*')

    response = await fetch(`${strapiUrl}/api/articles?${queryParams.toString()}`, {
      headers,
    })

    if (!response.ok) {
      const errorText = await response.text()
      let error
      try {
        error = JSON.parse(errorText)
      } catch {
        error = { message: errorText || 'Ошибка загрузки данных' }
      }
      throw createError({
        statusCode: response.status,
        statusMessage: error.error?.message || error.message || 'Ошибка загрузки данных'
      })
    }

    data = await response.json()

    if (!data.data || data.data.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: `Статья со slug "${param}" не найдена`
      })
    }

    return data
  }
})

