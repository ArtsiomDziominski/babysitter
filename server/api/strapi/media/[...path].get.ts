export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const strapiUrl = config.strapiUrl
  const path = getRouterParam(event, 'path')

  if (!path) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Path обязателен'
    })
  }

  const response = await fetch(`${strapiUrl}/${path}`, {
    method: 'GET',
  })

  if (!response.ok) {
    throw createError({
      statusCode: response.status,
      statusMessage: 'Ошибка загрузки изображения'
    })
  }

  const contentType = response.headers.get('content-type') || 'image/jpeg'
  const buffer = await response.arrayBuffer()

  setHeader(event, 'Content-Type', contentType)
  setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')

  return Buffer.from(buffer)
})

