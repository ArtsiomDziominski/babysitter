<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Хлебные крошки -->
      <div class="mb-6">
        <UBreadcrumb :items="breadcrumbItems" />
      </div>

      <div v-if="sitter" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <!-- Верхний блок: фото и статистика -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          <!-- Фото -->
          <div class="lg:col-span-2 relative">
            <div class="relative w-full h-[400px] lg:h-[500px] bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
              <img
                v-if="sitter.avatar"
                :src="sitter.avatar"
                :alt="sitter.name"
                class="w-full h-full object-cover"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center text-gray-400"
              >
                <Icon name="i-lucide-user" size="96" />
              </div>
              
              <!-- Кнопки на фото -->
              <div class="absolute top-4 right-4 flex gap-2">
                <button
                  class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full p-2 hover:bg-white dark:hover:bg-gray-800 transition-colors"
                  @click="toggleFavorite"
                >
                  <Icon
                    :name="isFavorite ? 'i-lucide-heart' : 'i-lucide-heart'"
                    :class="isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-600 dark:text-gray-400'"
                    size="20"
                  />
                </button>
                <button
                  class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full p-2 hover:bg-white dark:hover:bg-gray-800 transition-colors"
                >
                  <Icon name="i-lucide-flag" size="20" class="text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              <div
                v-if="sitter.isOnline"
                class="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs flex items-center gap-1"
              >
                <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                Ситтер онлайн
              </div>
              <div
                v-else-if="sitter.lastSeenOnline"
                class="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs"
              >
                Был в онлайне {{ formatLastSeen(sitter.lastSeenOnline) }}
              </div>
            </div>
          </div>

          <!-- Статистика -->
          <div class="space-y-4">
            <div
              v-for="stat in stats"
              :key="stat.label"
              class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4"
            >
              <div class="flex items-center gap-3 mb-2">
                <div class="p-2 bg-primary/10 rounded-lg">
                  <Icon :name="stat.icon" size="24" class="text-primary-500" />
                </div>
                <div class="flex-1">
                  <div class="text-2xl font-bold text-gray-900 dark:text-white">
                    {{ stat.value }}
                  </div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">
                    {{ stat.label }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Информация о ситтере -->
        <div class="px-6 pb-6">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {{ sitter.name }}
          </h1>
          <div class="flex items-center gap-4 text-gray-600 dark:text-gray-400 mb-4">
            <span v-if="sitter.age">{{ sitter.age }} {{ getAgeText(sitter.age) }}</span>
            <span v-if="sitter.registeredAt">
              На сайте с {{ formatDate(sitter.registeredAt) }}
            </span>
          </div>

          <!-- Кнопки действий -->
          <div class="flex gap-4 mb-6">
            <UButton
              color="primary"
              size="lg"
              class="flex-1"
            >
              Позвать
            </UButton>
            <UButton
              variant="outline"
              size="lg"
              class="flex-1"
            >
              Написать
            </UButton>
          </div>

          <!-- Табы -->
          <div class="border-b border-gray-200 dark:border-gray-700 mb-6">
            <div class="flex gap-6 overflow-x-auto">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                class="px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors relative"
                :class="activeTab === tab.id
                  ? 'text-primary-500'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'"
              >
                {{ tab.label }}
                <span
                  v-if="activeTab === tab.id"
                  class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"
                ></span>
              </button>
            </div>
          </div>

          <!-- Контент табов -->
          <div class="min-h-[400px]">
            <!-- Обо мне -->
            <div v-if="activeTab === 'about'" class="space-y-4">
              <div v-if="sitter.education" class="mb-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Образование
                </h3>
                <p class="text-gray-700 dark:text-gray-300">
                  {{ sitter.education }}
                </p>
              </div>
              <div v-if="sitter.experience" class="mb-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Опыт работы
                </h3>
                <p class="text-gray-700 dark:text-gray-300">
                  {{ sitter.experience }}
                </p>
              </div>
              <div v-if="sitter.preferences" class="mb-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Предпочтения
                </h3>
                <p class="text-gray-700 dark:text-gray-300">
                  {{ sitter.preferences }}
                </p>
              </div>
              <div v-if="sitter.detailedDescription">
                <p class="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {{ sitter.detailedDescription }}
                </p>
              </div>
            </div>

            <!-- Отзывы -->
            <div v-if="activeTab === 'reviews'" class="space-y-6">
              <div
                v-for="review in sitter.reviews || []"
                :key="review.id"
                class="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0"
              >
                <div class="flex items-start justify-between mb-2">
                  <div>
                    <div class="font-semibold text-gray-900 dark:text-white">
                      {{ review.author }}
                    </div>
                    <div class="flex items-center gap-1 mt-1">
                      <Icon
                        v-for="i in 5"
                        :key="i"
                        name="i-lucide-star"
                        :class="i <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'"
                        size="16"
                      />
                    </div>
                  </div>
                  <span class="text-sm text-gray-500 dark:text-gray-400">
                    {{ formatDate(review.date) }}
                  </span>
                </div>
                <p class="text-gray-700 dark:text-gray-300 mt-2">
                  {{ review.text }}
                </p>
              </div>
              <div v-if="!sitter.reviews || sitter.reviews.length === 0" class="text-center py-12">
                <p class="text-gray-500 dark:text-gray-400">
                  Пока нет отзывов
                </p>
              </div>
            </div>

            <!-- Оплата -->
            <div v-if="activeTab === 'payment'" class="space-y-4">
              <div class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {{ sitter.price }} ₽/час
              </div>
              <div v-if="sitter.paymentMethods && sitter.paymentMethods.length > 0">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Способы оплаты
                </h3>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="method in sitter.paymentMethods"
                    :key="method"
                    class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm"
                  >
                    {{ method }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Расписание -->
            <div v-if="activeTab === 'schedule'" class="space-y-4">
              <div
                v-for="slot in sitter.schedule || []"
                :key="slot.day"
                class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <span class="font-medium text-gray-900 dark:text-white">
                  {{ slot.day }}
                </span>
                <div class="flex gap-2">
                  <span
                    v-for="time in slot.timeSlots"
                    :key="time"
                    class="px-3 py-1 bg-primary/10 text-primary-700 dark:text-primary-300 rounded text-sm"
                  >
                    {{ time }}
                  </span>
                </div>
              </div>
              <div v-if="!sitter.schedule || sitter.schedule.length === 0" class="text-center py-12">
                <p class="text-gray-500 dark:text-gray-400">
                  Расписание не указано
                </p>
              </div>
            </div>

            <!-- Условия работы -->
            <div v-if="activeTab === 'conditions'" class="space-y-4">
              <p v-if="sitter.workConditions" class="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {{ sitter.workConditions }}
              </p>
              <div v-else class="text-center py-12">
                <p class="text-gray-500 dark:text-gray-400">
                  Условия работы не указаны
                </p>
              </div>
            </div>

            <!-- Безопасность -->
            <div v-if="activeTab === 'safety'" class="space-y-4">
              <p v-if="sitter.safetyInfo" class="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {{ sitter.safetyInfo }}
              </p>
              <div v-else class="text-center py-12">
                <p class="text-gray-500 dark:text-gray-400">
                  Информация о безопасности не указана
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-12">
        <p class="text-gray-500 dark:text-gray-400">
          Ситтер не найден
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Sitter } from '~/types/sitter'

const route = useRoute()
const sitterId = route.params.id as string

const activeTab = ref('about')
const isFavorite = ref(false)

const breadcrumbItems = computed(() => [
  {
    label: 'Главная',
    icon: 'i-lucide-home',
    to: '/'
  },
  {
    label: 'Поиск',
    icon: 'i-lucide-search',
    to: '/search'
  },
  {
    label: sitter.value?.name || 'Ситтер',
    icon: 'i-lucide-user'
  }
])

const tabs = [
  { id: 'about', label: 'Обо мне' },
  { id: 'reviews', label: 'Отзывы' },
  { id: 'payment', label: 'Оплата' },
  { id: 'schedule', label: 'Расписание' },
  { id: 'conditions', label: 'Условия работы' },
  { id: 'safety', label: 'Безопасность' }
]

const sitter = ref<Sitter | null>(null)

const stats = computed(() => {
  if (!sitter.value) return []
  
  return [
    {
      icon: 'i-lucide-shopping-bag',
      value: sitter.value.orders,
      label: 'Заказа выполнено'
    },
    {
      icon: 'i-lucide-clock',
      value: sitter.value.hours,
      label: 'Часов с детьми'
    },
    {
      icon: 'i-lucide-repeat',
      value: sitter.value.returningClients || 0,
      label: 'Родителей вернулись'
    },
    {
      icon: 'i-lucide-message-circle',
      value: sitter.value.responseTime || 'В течение дня',
      label: 'Скорость ответа'
    }
  ]
})

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
}

const getAgeText = (age: number) => {
  const lastDigit = age % 10
  const lastTwoDigits = age % 100
  
  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return 'лет'
  }
  if (lastDigit === 1) {
    return 'год'
  }
  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'года'
  }
  return 'лет'
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const formatLastSeen = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) {
    return 'только что'
  }
  if (diffMins < 60) {
    const mins = diffMins % 60
    if (mins === 1) return '1 минуту назад'
    if (mins >= 2 && mins <= 4) return `${mins} минуты назад`
    return `${mins} минут назад`
  }
  if (diffHours < 24) {
    if (diffHours === 1) return '1 час назад'
    if (diffHours >= 2 && diffHours <= 4) return `${diffHours} часа назад`
    return `${diffHours} часов назад`
  }
  if (diffDays === 1) {
    return 'вчера'
  }
  if (diffDays < 7) {
    return `${diffDays} дней назад`
  }
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long'
  })
}

onMounted(() => {
  loadSitter()
})

const loadSitter = () => {
  const mockSitters: Sitter[] = [
    {
      id: '1',
      name: 'Аделина Ш.',
      avatar: 'https://github.com/benjamincanac.png',
      rating: 4.9,
      orders: 3,
      hours: 12,
      price: 500,
      description: 'Опытный бебиситтер с педагогическим образованием.',
      tags: ['Опыт 5+ лет', 'Педагог', 'С младенцами'],
      isNew: false,
      isOnline: true,
      isAvailable: true,
      advantages: ['infants', 'homework', 'music'],
      age: 22,
      registeredAt: '2025-12-08',
      education: 'Имею среднее профессиональное образование учителя начальных классов, а также незаконченное высшее образование логопеда и специального психолога!',
      experience: 'В период обучения проходила практику с детьми в школе, а также полтора года работала логопедом в центре коррекции, занималась развитием и коррекцией речи, а также различными развивающими играми для развития когнитивных функций детей в том числе',
      preferences: 'Имею хороший опыт работы с детьми любого возраста, в данный момент предпочтительно с детьми от 1 года',
      responseTime: 'В течение дня',
      returningClients: 0,
      reviews: [],
      paymentMethods: ['Наличные', 'Карта', 'Перевод'],
      schedule: [
        { day: 'Понедельник', timeSlots: ['09:00-18:00'] },
        { day: 'Вторник', timeSlots: ['09:00-18:00'] },
        { day: 'Среда', timeSlots: ['09:00-18:00'] },
        { day: 'Четверг', timeSlots: ['09:00-18:00'] },
        { day: 'Пятница', timeSlots: ['09:00-18:00'] }
      ]
    },
    {
      id: '2',
      name: 'Елена Смирнова',
      rating: 4.8,
      orders: 32,
      hours: 280,
      price: 600,
      description: 'Люблю детей и умею находить с ними общий язык.',
      tags: ['Активный', 'Английский язык'],
      isNew: true,
      isOnline: false,
      lastSeenOnline: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      isAvailable: true,
      advantages: ['active', 'english'],
      age: 25,
      registeredAt: '2024-01-15'
    },
    {
      id: '3',
      name: 'Мария Иванова',
      avatar: 'https://github.com/benjamincanac.png',
      rating: 5.0,
      orders: 67,
      hours: 450,
      price: 550,
      description: 'Медицинское образование, курсы первой помощи.',
      tags: ['Медик', 'Первая помощь', 'Особые дети'],
      isNew: false,
      isOnline: true,
      isAvailable: true,
      advantages: ['medical', 'firstAid', 'specialNeeds'],
      age: 28,
      registeredAt: '2023-06-20'
    },
    {
      id: '4',
      name: 'Ольга Сидорова',
      rating: 4.7,
      orders: 28,
      hours: 200,
      price: 450,
      description: 'Студентка педагогического университета.',
      tags: ['Студент', 'Подготовка к школе'],
      isNew: false,
      isOnline: false,
      lastSeenOnline: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      isAvailable: false,
      advantages: ['homework'],
      age: 21,
      registeredAt: '2024-03-10'
    },
    {
      id: '5',
      name: 'Татьяна Козлова',
      rating: 4.9,
      orders: 89,
      hours: 600,
      price: 700,
      description: 'Опытный бебиситтер, выпускница школы Kidsout.',
      tags: ['Kidsout', 'Опыт 10+ лет'],
      isNew: false,
      isOnline: true,
      isAvailable: true,
      advantages: ['kidsoutSchool', 'infants', 'homework'],
      age: 30,
      registeredAt: '2022-11-05'
    }
  ]

  const found = mockSitters.find(s => s.id === sitterId)
  if (found) {
    sitter.value = found
  }
}
</script>
