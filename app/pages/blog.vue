<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Блог
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Полезные статьи о воспитании детей и работе бебиситтеров
        </p>
      </div>

      <div class="flex gap-6">
        <BlogFilters
          v-model="filters"
          :tags="allTags"
          :categories="allCategories"
          class="w-80 flex-shrink-0"
        />

        <div class="flex-1">
          <div class="mb-6">
            <UInput
              v-model="filters.searchQuery"
              placeholder="Поиск по статьям..."
              icon="i-lucide-search"
              size="lg"
            />
          </div>

          <div v-if="selectedTags.length > 0" class="mb-4 flex flex-wrap gap-2">
            <UBadge
              v-for="tag in selectedTags"
              :key="tag"
              color="primary"
              variant="subtle"
              size="lg"
              class="cursor-pointer"
              @click="removeTag(tag)"
            >
              {{ tag }}
              <Icon name="i-lucide-x" class="ml-1" size="14" />
            </UBadge>
            <UButton
              variant="ghost"
              size="sm"
              @click="clearFilters"
            >
              Очистить все
            </UButton>
          </div>

          <div v-if="filteredPosts.length > 0" class="space-y-6">
            <BlogCard
              v-for="post in filteredPosts"
              :key="post.id"
              :post="post"
              @click="navigateToPost(post.id)"
            />
          </div>

          <div v-else class="text-center py-12">
            <p class="text-gray-500 dark:text-gray-400">
              Статьи не найдены
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BlogPost, BlogFilters } from '~/types/blog'

const filters = ref<BlogFilters>({
  selectedTags: [],
  selectedCategory: null,
  searchQuery: ''
})

const posts = ref<BlogPost[]>([
  {
    id: '1',
    title: 'Как выбрать надежного бебиситтера',
    excerpt: 'Руководство для родителей по выбору подходящего бебиситтера для вашего ребенка. На что обратить внимание при собеседовании.',
    content: '',
    author: {
      name: 'Анна Петрова',
      avatar: 'https://github.com/benjamincanac.png'
    },
    publishedAt: '2024-01-15',
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800',
    tags: ['Советы', 'Безопасность', 'Выбор'],
    category: 'Для родителей',
    readTime: 5,
    views: 1234
  },
  {
    id: '2',
    title: 'Первая помощь детям: что должен знать бебиситтер',
    excerpt: 'Основные навыки первой помощи, которые необходимы каждому бебиситтеру. Как действовать в экстренных ситуациях.',
    content: '',
    author: {
      name: 'Мария Иванова',
      avatar: 'https://github.com/benjamincanac.png'
    },
    publishedAt: '2024-01-10',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800',
    tags: ['Безопасность', 'Первая помощь', 'Обучение'],
    category: 'Для бебиситтеров',
    readTime: 8,
    views: 2156
  },
  {
    id: '3',
    title: 'Развивающие игры для детей разных возрастов',
    excerpt: 'Подборка развивающих игр и занятий, которые помогут бебиситтеру занять ребенка и способствовать его развитию.',
    content: '',
    author: {
      name: 'Елена Смирнова'
    },
    publishedAt: '2024-01-05',
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800',
    tags: ['Развитие', 'Игры', 'Обучение'],
    category: 'Для бебиситтеров',
    readTime: 6,
    views: 1890
  },
  {
    id: '4',
    title: 'Как установить доверительные отношения с ребенком',
    excerpt: 'Советы бебиситтерам о том, как быстро найти общий язык с ребенком и завоевать его доверие.',
    content: '',
    author: {
      name: 'Ольга Сидорова',
      avatar: 'https://github.com/benjamincanac.png'
    },
    publishedAt: '2024-01-01',
    tags: ['Психология', 'Советы', 'Работа'],
    category: 'Для бебиситтеров',
    readTime: 7,
    views: 1678
  },
  {
    id: '5',
    title: 'Правила безопасности дома: чек-лист для родителей',
    excerpt: 'Что проверить перед уходом, оставив ребенка с бебиситтером. Важные моменты безопасности.',
    content: '',
    author: {
      name: 'Татьяна Козлова'
    },
    publishedAt: '2023-12-28',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800',
    tags: ['Безопасность', 'Советы', 'Для родителей'],
    category: 'Для родителей',
    readTime: 4,
    views: 1456
  },
  {
    id: '6',
    title: 'Как подготовить ребенка к встрече с новым бебиситтером',
    excerpt: 'Практические советы родителям о том, как помочь ребенку адаптироваться к новому человеку.',
    content: '',
    author: {
      name: 'Анна Петрова',
      avatar: 'https://github.com/benjamincanac.png'
    },
    publishedAt: '2023-12-25',
    tags: ['Советы', 'Психология', 'Для родителей'],
    category: 'Для родителей',
    readTime: 5,
    views: 1123
  }
])

const allTags = computed(() => {
  const tagSet = new Set<string>()
  posts.value.forEach(post => {
    post.tags.forEach(tag => tagSet.add(tag))
  })
  return Array.from(tagSet).sort()
})

const allCategories = computed(() => {
  const categorySet = new Set<string>()
  posts.value.forEach(post => {
    categorySet.add(post.category)
  })
  return Array.from(categorySet).sort()
})

const selectedTags = computed(() => filters.value.selectedTags)

const filteredPosts = computed(() => {
  let result = [...posts.value]

  if (filters.value.searchQuery) {
    const query = filters.value.searchQuery.toLowerCase()
    result = result.filter(post =>
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query)
    )
  }

  if (filters.value.selectedTags.length > 0) {
    result = result.filter(post =>
      filters.value.selectedTags.some(tag => post.tags.includes(tag))
    )
  }

  if (filters.value.selectedCategory) {
    result = result.filter(post =>
      post.category === filters.value.selectedCategory
    )
  }

  return result
})

const removeTag = (tag: string) => {
  filters.value.selectedTags = filters.value.selectedTags.filter(t => t !== tag)
}

const clearFilters = () => {
  filters.value.selectedTags = []
  filters.value.selectedCategory = null
  filters.value.searchQuery = ''
}

const router = useRouter()

const navigateToPost = (postId: string) => {
  router.push(`/blog/${postId}`)
}
</script>
