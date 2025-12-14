export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: {
    name: string
    avatar?: string
  }
  publishedAt: string
  image?: string
  tags: string[]
  category: string
  readTime: number
  views: number
}

export interface BlogFilters {
  selectedTags: string[]
  selectedCategory: string | null
  searchQuery: string
}
