export interface StrapiTextChild {
  type: 'text'
  text: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
  code?: boolean
}

export interface StrapiListItem {
  type: 'list-item'
  children: StrapiTextChild[]
}

export interface StrapiBlock {
  type: 'heading' | 'paragraph' | 'list' | 'quote'
  level?: number
  format?: 'ordered' | 'unordered'
  children: (StrapiTextChild | StrapiListItem)[]
}

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string | StrapiBlock[]
  author: {
    name: string
    avatar?: string
  } | null
  publishedAt: string
  image?: string
  tags: string[]
  category: string
  readTime: number
  views: number
  slug?: string
  coverImage?: string | string[]
  published?: string
  categories?: Array<{ id: number; name: string; slug: string }>
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
  sort?: string
  order?: 'asc' | 'desc'
}
