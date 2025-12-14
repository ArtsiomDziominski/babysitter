<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <!-- Заголовок и поиск -->
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {{ $t('bookings.title') }}
          </h1>

          <!-- Форма поиска -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <UInput
              v-model="searchForm.address"
              :placeholder="$t('bookings.search.city')"
              icon="i-lucide-map-pin"
              size="lg"
            />
            <UInput
              v-model="searchForm.date"
              type="date"
              :placeholder="$t('bookings.search.date')"
              icon="i-lucide-calendar"
              size="lg"
            />
            <UInput
              v-model="searchForm.timeStart"
              type="time"
              :placeholder="$t('bookings.search.timeStart')"
              icon="i-lucide-clock"
              size="lg"
            />
            <UInput
              v-model="searchForm.timeEnd"
              type="time"
              :placeholder="$t('bookings.search.timeEnd')"
              icon="i-lucide-clock"
              size="lg"
            />
          </div>
          <div class="mt-4 flex justify-end">
            <UButton
              color="primary"
              size="lg"
              @click="handleSearch"
            >
              {{ $t('bookings.search.submit') }}
            </UButton>
          </div>
        </div>

        <div class="flex">
          <!-- Боковая панель с фильтрами -->
          <div class="w-80 border-r border-gray-200 dark:border-gray-700 p-6 overflow-y-auto max-h-[calc(100vh-20rem)]">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {{ $t('bookings.filters.title') }}
            </h2>

            <div class="space-y-6">
              <!-- Только доступные -->
              <div>
                <UCheckbox
                  v-model="filters.onlyAvailable"
                  :label="$t('bookings.filters.onlyAvailable')"
                />
              </div>

              <!-- Только онлайн -->
              <div>
                <UCheckbox
                  v-model="filters.onlyOnline"
                  :label="$t('bookings.filters.onlyOnline')"
                />
              </div>

              <!-- Цена -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ $t('bookings.filters.priceRange') }}
                </label>
                <div class="flex gap-2">
                  <UInput
                    v-model.number="filters.priceMin"
                    type="number"
                    :placeholder="$t('bookings.filters.priceFrom')"
                    size="sm"
                  />
                  <UInput
                    v-model.number="filters.priceMax"
                    type="number"
                    :placeholder="$t('bookings.filters.priceTo')"
                    size="sm"
                  />
                </div>
              </div>

              <!-- Количество детей -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ $t('bookings.filters.childrenCount') }}
                </label>
                <UInput
                  v-model.number="filters.childrenCount"
                  type="number"
                  min="1"
                  size="sm"
                />
              </div>

              <!-- Основные преимущества -->
              <div>
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  {{ $t('bookings.filters.advantages.main.title') }}
                </h3>
                <div class="space-y-2">
                  <UCheckbox
                    v-model="filters.advantages.kidsoutSchool"
                    :label="$t('bookings.filters.advantages.main.kidsoutSchool')"
                  />
                  <UCheckbox
                    v-model="filters.advantages.infants"
                    :label="$t('bookings.filters.advantages.main.infants')"
                  />
                  <UCheckbox
                    v-model="filters.advantages.specialNeeds"
                    :label="$t('bookings.filters.advantages.main.specialNeeds')"
                  />
                </div>
              </div>

              <!-- Дополнительные преимущества -->
              <div>
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  {{ $t('bookings.filters.advantages.additional.title') }}
                </h3>
                <div class="space-y-2 max-h-64 overflow-y-auto">
                  <UCheckbox
                    v-model="filters.advantages.homework"
                    :label="$t('bookings.filters.advantages.additional.homework')"
                  />
                  <UCheckbox
                    v-model="filters.advantages.french"
                    :label="$t('bookings.filters.advantages.additional.french')"
                  />
                  <UCheckbox
                    v-model="filters.advantages.music"
                    :label="$t('bookings.filters.advantages.additional.music')"
                  />
                  <UCheckbox
                    v-model="filters.advantages.active"
                    :label="$t('bookings.filters.advantages.additional.active')"
                  />
                  <UCheckbox
                    v-model="filters.advantages.english"
                    :label="$t('bookings.filters.advantages.additional.english')"
                  />
                  <UCheckbox
                    v-model="filters.advantages.driver"
                    :label="$t('bookings.filters.advantages.additional.driver')"
                  />
                  <UCheckbox
                    v-model="filters.advantages.medical"
                    :label="$t('bookings.filters.advantages.additional.medical')"
                  />
                  <UCheckbox
                    v-model="filters.advantages.firstAid"
                    :label="$t('bookings.filters.advantages.additional.firstAid')"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Основной контент -->
          <div class="flex-1 p-6">
            <!-- Сортировка и вид -->
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-4">
                <span class="text-sm text-gray-600 dark:text-gray-400">
                  {{ $t('bookings.found') }}: {{ filteredSitters.length }}
                </span>
                <USelect
                  v-model="sortBy"
                  :items="sortOptions"
                  labelKey="label"
                  valueKey="value"
                  size="sm"
                />
              </div>
              <div class="flex items-center gap-2">
                <UButton
                  :variant="viewMode === 'list' ? 'solid' : 'outline'"
                  color="primary"
                  size="sm"
                  @click="viewMode = 'list'"
                >
                  <Icon name="i-lucide-list" />
                </UButton>
                <UButton
                  :variant="viewMode === 'map' ? 'solid' : 'outline'"
                  color="primary"
                  size="sm"
                  @click="viewMode = 'map'"
                >
                  <Icon name="i-lucide-map" />
                </UButton>
              </div>
            </div>

            <!-- Список нянь -->
            <div v-if="viewMode === 'list'" class="space-y-4">
              <div
                v-for="sitter in filteredSitters"
                :key="sitter.id"
                class="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div class="flex gap-6">
                  <!-- Аватар -->
                  <div class="flex-shrink-0">
                    <UAvatar
                      :src="sitter.avatar"
                      :alt="sitter.name"
                      size="xl"
                      class="border-2 border-gray-200 dark:border-gray-700"
                    />
                    <div
                      v-if="sitter.isNew"
                      class="mt-2 text-xs text-center px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded"
                    >
                      {{ $t('bookings.sitter.new') }}
                    </div>
                  </div>

                  <!-- Информация -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between mb-2">
                      <div>
                        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                          {{ sitter.name }}
                        </h3>
                        <div class="flex items-center gap-2 mt-1">
                          <div class="flex items-center">
                            <Icon name="i-lucide-star" class="text-yellow-400" />
                            <span class="ml-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                              {{ sitter.rating }}
                            </span>
                          </div>
                          <span class="text-sm text-gray-500 dark:text-gray-400">
                            {{ sitter.orders }} {{ $t('bookings.sitter.orders') }}
                          </span>
                          <span class="text-sm text-gray-500 dark:text-gray-400">
                            {{ sitter.hours }} {{ $t('bookings.sitter.hours') }}
                          </span>
                        </div>
                      </div>
                      <div class="text-right">
                        <div class="text-2xl font-bold text-gray-900 dark:text-white">
                          {{ sitter.price }} ₽
                          <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
                            {{ $t('bookings.sitter.perHour') }}
                          </span>
                        </div>
                      </div>
                    </div>

                    <!-- Описание -->
                    <p class="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {{ sitter.description }}
                    </p>

                    <!-- Теги -->
                    <div class="flex flex-wrap gap-2 mb-4">
                      <span
                        v-for="tag in sitter.tags"
                        :key="tag"
                        class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                      >
                        {{ tag }}
                      </span>
                    </div>

                    <!-- Кнопка -->
                    <UButton
                      color="primary"
                      size="lg"
                      block
                      @click="handleBook(sitter.id)"
                    >
                      {{ $t('bookings.sitter.book') }}
                    </UButton>
                  </div>
                </div>
              </div>

              <!-- Пустое состояние -->
              <div
                v-if="filteredSitters.length === 0"
                class="text-center py-12"
              >
                <p class="text-gray-500 dark:text-gray-400">
                  {{ $t('bookings.empty') }}
                </p>
              </div>
            </div>

            <!-- Карта -->
            <div v-else class="h-[calc(100vh-20rem)] bg-gray-100 dark:bg-gray-900 rounded-lg flex items-center justify-center">
              <p class="text-gray-500 dark:text-gray-400">
                {{ $t('bookings.mapPlaceholder') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Sitter {
  id: string
  name: string
  avatar?: string
  rating: number
  orders: number
  hours: number
  price: number
  description: string
  tags: string[]
  isNew?: boolean
  isOnline?: boolean
  isAvailable?: boolean
  advantages: string[]
}

const { t } = useI18n()

const searchForm = ref({
  address: '',
  date: '',
  timeStart: '',
  timeEnd: ''
})

const filters = ref({
  onlyAvailable: false,
  onlyOnline: false,
  priceMin: undefined as number | undefined,
  priceMax: undefined as number | undefined,
  childrenCount: undefined as number | undefined,
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
const viewMode = ref<'list' | 'map'>('list')

const sortOptions = computed(() => {
  try {
    return [
      { label: t('bookings.sort.recommended'), value: 'recommended' },
      { label: t('bookings.sort.priceAsc'), value: 'priceAsc' },
      { label: t('bookings.sort.priceDesc'), value: 'priceDesc' },
      { label: t('bookings.sort.rating'), value: 'rating' },
      { label: t('bookings.sort.newest'), value: 'newest' }
    ]
  } catch {
    return []
  }
})

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

const filteredSitters = computed(() => {
  let result = [...sitters.value]

  if (filters.value.onlyAvailable) {
    result = result.filter(s => s.isAvailable)
  }

  if (filters.value.onlyOnline) {
    result = result.filter(s => s.isOnline)
  }

  if (filters.value.priceMin !== undefined) {
    result = result.filter(s => s.price >= filters.value.priceMin!)
  }

  if (filters.value.priceMax !== undefined) {
    result = result.filter(s => s.price <= filters.value.priceMax!)
  }

  const activeAdvantages = Object.entries(filters.value.advantages)
    .filter(([_, value]) => value)
    .map(([key]) => key)

  if (activeAdvantages.length > 0) {
    result = result.filter(s =>
      activeAdvantages.some(adv => s.advantages.includes(adv))
    )
  }

  if (sortBy.value === 'priceAsc') {
    result.sort((a, b) => a.price - b.price)
  } else if (sortBy.value === 'priceDesc') {
    result.sort((a, b) => b.price - a.price)
  } else if (sortBy.value === 'rating') {
    result.sort((a, b) => b.rating - a.rating)
  } else if (sortBy.value === 'newest') {
    result.sort((a, b) => {
      if (a.isNew && !b.isNew) return -1
      if (!a.isNew && b.isNew) return 1
      return 0
    })
  }

  return result
})

const handleSearch = () => {
  console.log('Search:', searchForm.value)
}

const handleBook = (sitterId: string) => {
  console.log('Book sitter:', sitterId)
}
</script>
