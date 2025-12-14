<template>
  <div class="min-h-[400px]">
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
</template>

<script setup lang="ts">
import type { Sitter } from '~/types/sitter'
import { useSitterUtils } from '~/composables/useSitterUtils'

defineProps<{
  sitter: Sitter
  activeTab: string
}>()

const { formatDate } = useSitterUtils()
</script>
