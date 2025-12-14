<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-6">
        <UBreadcrumb :items="breadcrumbItems" />
      </div>

      <div v-if="sitter" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <SitterHeader
          :sitter="sitter"
          :is-favorite="isFavorite"
          @toggle-favorite="toggleFavorite"
        />

        <SitterInfo :sitter="sitter" />

        <div class="px-6 pb-6">
          <SitterActions />

          <SitterTabs
            :active-tab="activeTab"
            @update:active-tab="activeTab = $event"
          />

          <SitterTabContent
            :sitter="sitter"
            :active-tab="activeTab"
          />
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
const sitter = ref<Sitter | null>(null)

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

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
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
