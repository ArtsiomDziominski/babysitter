<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <SearchForm
          v-model="searchForm"
          @search="handleSearch"
        />

        <div class="flex">
          <SearchFilters v-model="filters" />

          <div class="flex-1 p-6">
            <SearchToolbar
              :count="filteredSitters.length"
              v-model:sort-by="sortBy"
              v-model:view-mode="viewMode"
            />

            <SearchSitterList
              v-if="viewMode === 'list'"
              :sitters="filteredSitters"
              @book="handleBook"
            />

            <SearchSitterCard
              v-else-if="viewMode === 'card'"
              :sitters="filteredSitters"
              @book="handleBook"
            />

            <SearchSitterMap v-else />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Sitter, SearchForm, SearchFilters } from '~/types/sitter'

const searchForm = ref<SearchForm>({
  address: '',
  date: '',
  timeStart: '',
  timeEnd: ''
})

const filters = ref<SearchFilters>({
  onlyAvailable: false,
  onlyOnline: false,
  priceMin: undefined,
  priceMax: undefined,
  childrenCount: undefined,
  advantages: {
    kidsoutSchool: false,
    infants: false,
    specialNeeds: false,
    homework: false,
    french: false,
    music: false,
    active: false,
    english: false,
    driver: false,
    medical: false,
    firstAid: false
  }
})

const sortBy = ref('recommended')
const viewMode = ref<'list' | 'card' | 'map'>('list')

const sitters = ref<Sitter[]>([
  {
    id: '1',
    name: 'Анна Петрова',
    avatar: 'https://github.com/benjamincanac.png',
    rating: 4.9,
    orders: 45,
    hours: 320,
    price: 500,
    description: 'Опытный бебиситтер с педагогическим образованием. Работаю с детьми от 1 года. Помогаю с уроками, развиваю творческие способности.',
    tags: ['Опыт 5+ лет', 'Педагог', 'С младенцами'],
    isNew: false,
    isOnline: true,
    isAvailable: true,
    advantages: ['infants', 'homework', 'music']
  },
  {
    id: '2',
    name: 'Елена Смирнова',
    rating: 4.8,
    orders: 32,
    hours: 280,
    price: 600,
    description: 'Люблю детей и умею находить с ними общий язык. Активные игры, прогулки, помощь с домашним заданием.',
    tags: ['Активный', 'Английский язык'],
    isNew: true,
    isOnline: false,
    isAvailable: true,
    advantages: ['active', 'english']
  },
  {
    id: '3',
    name: 'Мария Иванова',
    avatar: 'https://github.com/benjamincanac.png',
    rating: 5.0,
    orders: 67,
    hours: 450,
    price: 550,
    description: 'Медицинское образование, курсы первой помощи. Работаю с детьми с особыми потребностями.',
    tags: ['Медик', 'Первая помощь', 'Особые дети'],
    isNew: false,
    isOnline: true,
    isAvailable: true,
    advantages: ['medical', 'firstAid', 'specialNeeds']
  },
  {
    id: '4',
    name: 'Ольга Сидорова',
    rating: 4.7,
    orders: 28,
    hours: 200,
    price: 450,
    description: 'Студентка педагогического университета. Помогаю с уроками, подготовкой к школе.',
    tags: ['Студент', 'Подготовка к школе'],
    isNew: false,
    isOnline: false,
    isAvailable: false,
    advantages: ['homework']
  },
  {
    id: '5',
    name: 'Татьяна Козлова',
    rating: 4.9,
    orders: 89,
    hours: 600,
    price: 700,
    description: 'Опытный бебиситтер, выпускница школы Kidsout. Работаю с детьми любого возраста.',
    tags: ['Kidsout', 'Опыт 10+ лет'],
    isNew: false,
    isOnline: true,
    isAvailable: true,
    advantages: ['kidsoutSchool', 'infants', 'homework']
  }
])

const { filteredSitters } = useSitterFilter(sitters, filters, sortBy)

const handleSearch = () => {
  console.log('Search:', searchForm.value)
}

const handleBook = (sitterId: string) => {
  console.log('Book sitter:', sitterId)
}
</script>
