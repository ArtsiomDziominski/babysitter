<template>
  <div class="min-h-[400px]">
    <div v-if="activeTab === 'about'" class="space-y-6">
      <div v-if="sitter.detailedDescription" class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
          О себе
        </h3>
        <p class="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
          {{ sitter.detailedDescription }}
        </p>
      </div>

      <div v-if="sitter.education" class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
        <div class="flex items-center gap-3 mb-4">
          <div class="p-2 bg-primary/10 rounded-lg">
            <Icon name="i-lucide-graduation-cap" size="24" class="text-primary-500" />
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">
            Образование
          </h3>
        </div>
        <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
          {{ sitter.education }}
        </p>
      </div>

      <div v-if="sitter.experience" class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
        <div class="flex items-center gap-3 mb-4">
          <div class="p-2 bg-primary/10 rounded-lg">
            <Icon name="i-lucide-briefcase" size="24" class="text-primary-500" />
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">
            Опыт работы
          </h3>
        </div>
        <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
          {{ sitter.experience }}
        </p>
      </div>

      <div v-if="sitter.preferences" class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
        <div class="flex items-center gap-3 mb-4">
          <div class="p-2 bg-primary/10 rounded-lg">
            <Icon name="i-lucide-heart" size="24" class="text-primary-500" />
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">
            Предпочтения
          </h3>
        </div>
        <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
          {{ sitter.preferences }}
        </p>
      </div>
    </div>

    <div v-if="activeTab === 'reviews'" class="space-y-4">
      <div
        v-for="review in sitter.reviews || []"
        :key="review.id"
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8 hover:shadow-md transition-shadow"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <span class="text-primary-600 dark:text-primary-400 font-bold text-lg">
                  {{ review.author.charAt(0).toUpperCase() }}
                </span>
              </div>
              <div>
                <div class="font-semibold text-gray-900 dark:text-white text-lg">
                  {{ review.author }}
                </div>
                <div class="flex items-center gap-1 mt-1">
                  <Icon
                    v-for="i in 5"
                    :key="i"
                    name="i-lucide-star"
                    :class="i <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'"
                    size="18"
                  />
                </div>
              </div>
            </div>
          </div>
          <span class="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
            {{ formatDate(review.date) }}
          </span>
        </div>
        <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
          {{ review.text }}
        </p>
      </div>
      <div v-if="!sitter.reviews || sitter.reviews.length === 0" class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
        <Icon name="i-lucide-message-square" size="48" class="text-gray-400 mx-auto mb-4" />
        <p class="text-gray-500 dark:text-gray-400 text-lg">
          Пока нет отзывов
        </p>
      </div>
    </div>

    <div v-if="activeTab === 'payment'" class="space-y-6">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
        <div class="flex items-center gap-3 mb-6">
          <div class="p-2 bg-primary/10 rounded-lg">
            <Icon name="i-lucide-wallet" size="24" class="text-primary-500" />
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">
            Оплата
          </h3>
        </div>
        <div class="text-4xl font-bold text-gray-900 dark:text-white mb-6">
          {{ sitter.price }} {{ siteConfig.currency }}<span class="text-xl text-gray-500 dark:text-gray-400">/час</span>
        </div>
        <div v-if="sitter.paymentMethods && sitter.paymentMethods.length > 0">
          <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Способы оплаты
          </h4>
          <div class="flex flex-wrap gap-3">
            <span
              v-for="method in sitter.paymentMethods"
              :key="method"
              class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium"
            >
              {{ method }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'schedule'" class="space-y-3">
      <div
        v-for="slot in sitter.schedule || []"
        :key="slot.day"
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 md:p-6 hover:shadow-md transition-shadow"
      >
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-primary/10 rounded-lg">
              <Icon name="i-lucide-calendar" size="20" class="text-primary-500" />
            </div>
            <span class="font-semibold text-lg text-gray-900 dark:text-white">
              {{ slot.day }}
            </span>
          </div>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="time in slot.timeSlots"
              :key="time"
              class="px-4 py-2 bg-primary/10 text-primary-700 dark:text-primary-300 rounded-lg text-sm font-medium"
            >
              {{ time }}
            </span>
          </div>
        </div>
      </div>
      <div v-if="!sitter.schedule || sitter.schedule.length === 0" class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
        <Icon name="i-lucide-calendar-x" size="48" class="text-gray-400 mx-auto mb-4" />
        <p class="text-gray-500 dark:text-gray-400 text-lg">
          Расписание не указано
        </p>
      </div>
    </div>

    <div v-if="activeTab === 'conditions'">
      <div v-if="sitter.workConditions" class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
        <div class="flex items-center gap-3 mb-6">
          <div class="p-2 bg-primary/10 rounded-lg">
            <Icon name="i-lucide-file-text" size="24" class="text-primary-500" />
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">
            Условия работы
          </h3>
        </div>
        <p class="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
          {{ sitter.workConditions }}
        </p>
      </div>
      <div v-else class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
        <Icon name="i-lucide-file-x" size="48" class="text-gray-400 mx-auto mb-4" />
        <p class="text-gray-500 dark:text-gray-400 text-lg">
          Условия работы не указаны
        </p>
      </div>
    </div>

    <div v-if="activeTab === 'safety'">
      <div v-if="sitter.safetyInfo" class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
        <div class="flex items-center gap-3 mb-6">
          <div class="p-2 bg-primary/10 rounded-lg">
            <Icon name="i-lucide-shield-check" size="24" class="text-primary-500" />
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">
            Безопасность
          </h3>
        </div>
        <p class="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
          {{ sitter.safetyInfo }}
        </p>
      </div>
      <div v-else class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
        <Icon name="i-lucide-shield-alert" size="48" class="text-gray-400 mx-auto mb-4" />
        <p class="text-gray-500 dark:text-gray-400 text-lg">
          Информация о безопасности не указана
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Sitter } from '~/types/sitter'
import { useSitterUtils } from '~/composables/useSitterUtils'

const siteConfig = useSiteConfig()

defineProps<{
  sitter: Sitter
  activeTab: string
}>()

const { formatDate } = useSitterUtils()
</script>
