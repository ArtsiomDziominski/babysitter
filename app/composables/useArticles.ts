import type { BlogPost, ArticlesResponse, ArticleQueryParams } from '~/types/blog'

export const useArticles = () => {
  const config = useRuntimeConfig()

  const getArticles = async (params?: ArticleQueryParams): Promise<ArticlesResponse> => {
    const queryParams = new URLSearchParams()
    
    queryParams.append('populate', '*')
    
    if (params?.page) {
      queryParams.append('pagination[page]', params.page.toString())
    }
    if (params?.limit) {
      queryParams.append('pagination[pageSize]', params.limit.toString())
    }
    if (params?.search) {
      queryParams.append('filters[$or][0][title][$containsi]', params.search)
      queryParams.append('filters[$or][1][excerpt][$containsi]', params.search)
      queryParams.append('filters[$or][2][content][$containsi]', params.search)
    }
    if (params?.category) {
      queryParams.append('filters[categories][name][$eq]', params.category)
    }
    if (params?.tag) {
      const tags = params.tag.split(',')
      tags.forEach((tag, index) => {
        queryParams.append(`filters[tags][name][$in][${index}]`, tag.trim())
      })
    }
    if (params?.sort) {
      const sortField = params.sort === 'published' ? 'publishedAt' : params.sort
      const sortOrder = params?.order || 'desc'
      queryParams.append('sort', `${sortField}:${sortOrder}`)
    } else {
      queryParams.append('sort', 'publishedAt:desc')
    }

    const query = queryParams.toString()
    const response = await $fetch<{ data: any[]; meta: any }>(`/api/strapi/articles?${query}`)
    
    return {
      data: response.data.map(transformStrapiArticle),
      meta: {
        page: response.meta.pagination.page,
        limit: response.meta.pagination.pageSize,
        total: response.meta.pagination.total,
        totalPages: response.meta.pagination.pageCount
      }
    }
  }

  const getArticle = async (slug: string): Promise<BlogPost> => {
    const response = await $fetch<{ data: any[] }>(`/api/strapi/articles/${slug}`)
    
    if (!response.data || response.data.length === 0) {
      throw new Error('Статья не найдена')
    }
    
    const article = transformStrapiArticle(response.data[0])
    console.log('Transformed article content:', article.content)
    return article
  }

  const getArticleById = async (id: number): Promise<BlogPost> => {
    const response = await $fetch<{ data: any }>(`/api/strapi/articles/${id}`)
    return transformStrapiArticle(response.data)
  }

  const transformStrapiArticle = (strapiArticle: any): BlogPost => {
    const article = strapiArticle.attributes || strapiArticle
    
    const getAuthor = () => {
      if (article.author?.data) {
        const authorData = article.author.data.attributes || article.author.data
        return {
          id: article.author.data.id,
          firstName: authorData.first_name || authorData.firstName || '',
          secondName: authorData.second_name || authorData.secondName || '',
          avatar: authorData.avatar?.data 
            ? getStrapiImageUrl(authorData.avatar.data)
            : undefined
        }
      }
      if (article.author && !article.author.data) {
        return {
          id: article.author.id,
          firstName: article.author.first_name || article.author.firstName || '',
          secondName: article.author.second_name || article.author.secondName || '',
          avatar: undefined
        }
      }
      return undefined
    }
    
    const getCategories = () => {
      if (article.categories?.data) {
        return article.categories.data.map((cat: any) => {
          const catData = cat.attributes || cat
          return {
            id: cat.id,
            name: catData.name || '',
            slug: catData.slug || ''
          }
        })
      }
      if (Array.isArray(article.categories)) {
        return article.categories.map((cat: any) => ({
          id: cat.id,
          name: cat.name || '',
          slug: cat.slug || ''
        }))
      }
      return undefined
    }
    
    const getTags = () => {
      if (article.tags?.data) {
        return article.tags.data.map((tag: any) => {
          const tagData = tag.attributes || tag
          return {
            id: tag.id,
            name: tagData.name || '',
            slug: tagData.slug || ''
          }
        })
      }
      if (Array.isArray(article.tags)) {
        return article.tags.map((tag: any) => ({
          id: tag.id,
          name: tag.name || '',
          slug: tag.slug || ''
        }))
      }
      return undefined
    }
    
    const getCoverImage = () => {
      if (article.coverImage?.data) {
        const images = Array.isArray(article.coverImage.data) 
          ? article.coverImage.data 
          : [article.coverImage.data]
        return images.map((img: any) => getStrapiImageUrl(img))
      }
      if (Array.isArray(article.coverImage)) {
        return article.coverImage.map((img: any) => getStrapiImageUrl(img))
      }
      return undefined
    }
    
    const content = article.content
    
    return {
      id: strapiArticle.id,
      title: article.title || '',
      slug: article.slug || '',
      excerpt: article.excerpt || '',
      content: Array.isArray(content) ? content : (typeof content === 'string' ? content : ''),
      coverImage: getCoverImage(),
      author: getAuthor(),
      published: article.published || article.publishedAt || undefined,
      categories: getCategories(),
      tags: getTags(),
      seoTitle: article.seoTitle || article.title,
      seoDescription: article.seoDescription || article.excerpt,
      seoKeywords: article.seoKeywords || undefined,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt
    }
  }

  const getStrapiImageUrl = (imageData: any): string => {
    if (!imageData) return ''
    const url = imageData.attributes?.url || imageData.url || ''
    if (url.startsWith('http')) return url
    return `/api/strapi/media${url.startsWith('/') ? url : `/${url}`}`
  }

  return {
    getArticles,
    getArticle,
    getArticleById
  }
}

