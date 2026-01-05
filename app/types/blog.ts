export interface StrapiBlock {
  type: string
  level?: number
  children?: Array<{
    type: string
    text?: string
    bold?: boolean
    italic?: boolean
    underline?: boolean
    strikethrough?: boolean
    code?: boolean
    [key: string]: any
  }>
  [key: string]: any
}

export interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt?: string
  content: string | StrapiBlock[]
  coverImage?: string | string[]
  author?: {
    id: number
    firstName: string
    secondName: string
    avatar?: string
  }
  published?: string
  categories?: Array<{
    id: number
    name: string
    slug: string
  }>
  tags?: Array<{
    id: number
    name: string
    slug: string
  }>
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string
  createdAt?: string
  updatedAt?: string
}

export interface BlogFilters {
  selectedTags: string[]
  selectedCategory: string | null
  searchQuery: string
}

export interface ArticlesResponse {
  data: BlogPost[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ArticleQueryParams {
  page?: number
  limit?: number
  search?: string
  category?: string
  tag?: string
  sort?: 'published' | 'createdAt' | 'title'
  order?: 'asc' | 'desc'
}
