<template>
  <div class="relative group">
    <div class="text-2xl max-xl:text-lg font-bold text-gray-900 dark:text-white cursor-pointer break-words">
      {{ priceOneChild ? parseFloat(priceOneChild) : 0 }} ₽
      <span class="text-sm max-xl:text-xs font-normal text-gray-500 dark:text-gray-400">
        {{ $t('bookings.sitter.perHour') }}
      </span>
    </div>
    <div class="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 p-4">
      <div class="space-y-3">
        <div v-if="priceOneChild" class="flex justify-between items-center">
          <span class="text-sm text-gray-600 dark:text-gray-400">1 ребенок:</span>
          <span class="text-sm font-semibold text-gray-900 dark:text-white">
            {{ parseFloat(priceOneChild) }} ₽/час
          </span>
        </div>
        <div v-if="priceTwoChildren" class="flex justify-between items-center">
          <span class="text-sm text-gray-600 dark:text-gray-400">2 ребенка:</span>
          <span class="text-sm font-semibold text-gray-900 dark:text-white">
            {{ parseFloat(priceTwoChildren) }} ₽/час
          </span>
        </div>
        <div v-if="priceThreeChildren" class="flex justify-between items-center">
          <span class="text-sm text-gray-600 dark:text-gray-400">3 ребенка:</span>
          <span class="text-sm font-semibold text-gray-900 dark:text-white">
            {{ parseFloat(priceThreeChildren) }} ₽/час
          </span>
        </div>
        <div v-if="onlineLesson" class="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
          <span class="text-sm text-gray-600 dark:text-gray-400">Онлайн урок:</span>
          <span class="text-sm font-semibold text-gray-900 dark:text-white">
            {{ parseFloat(onlineLesson) }} ₽/час
          </span>
        </div>
        <div v-if="minOrderAmount" class="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
          <span class="text-sm text-gray-600 dark:text-gray-400">Минимальный заказ:</span>
          <span class="text-sm font-semibold text-gray-900 dark:text-white">
            {{ parseFloat(minOrderAmount) }} ₽
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  priceOneChild?: string
  priceTwoChildren?: string
  priceThreeChildren?: string
  onlineLesson?: string
  minOrderAmount?: string
}>()
</script>

