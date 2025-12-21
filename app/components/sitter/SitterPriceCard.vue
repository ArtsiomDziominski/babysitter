<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
    <div class="space-y-4 mb-6">
      <div v-if="sitter.priceOneChild || sitter.priceTwoChildren || sitter.priceThreeChildren">
        <div class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Цены по количеству детей
        </div>
        <div class="space-y-2">
          <div v-if="sitter.priceOneChild" class="flex justify-between items-center text-sm">
            <span class="text-gray-600 dark:text-gray-400">1 ребенок</span>
            <span class="font-semibold text-gray-900 dark:text-white">{{ parseFloat(sitter.priceOneChild) }} ₽/час</span>
          </div>
          <div v-if="sitter.priceTwoChildren" class="flex justify-between items-center text-sm">
            <span class="text-gray-600 dark:text-gray-400">2 ребенка</span>
            <span class="font-semibold text-gray-900 dark:text-white">{{ parseFloat(sitter.priceTwoChildren) }} ₽/час</span>
          </div>
          <div v-if="sitter.priceThreeChildren" class="flex justify-between items-center text-sm">
            <span class="text-gray-600 dark:text-gray-400">3 ребенка</span>
            <span class="font-semibold text-gray-900 dark:text-white">{{ parseFloat(sitter.priceThreeChildren) }} ₽/час</span>
          </div>
        </div>
      </div>

      <div v-if="sitter.onlineLesson" class="pt-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-2">
            <Icon name="i-lucide-monitor" size="18" class="text-primary-500" />
            <span class="text-sm font-semibold text-gray-900 dark:text-white">Онлайн-занятие</span>
          </div>
          <span class="font-semibold text-gray-900 dark:text-white">{{ parseFloat(sitter.onlineLesson) }} ₽/час</span>
        </div>
      </div>

      <div v-if="sitter.minOrderAmount" class="pt-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-2">
            <Icon name="i-lucide-wallet" size="18" class="text-primary-500" />
            <span class="text-sm font-semibold text-gray-900 dark:text-white">Минимальный заказ</span>
          </div>
          <span class="font-semibold text-gray-900 dark:text-white">{{ parseFloat(sitter.minOrderAmount) }} ₽</span>
        </div>
      </div>
    </div>

    <div v-if="sitter.paymentMethods && sitter.paymentMethods.length > 0" class="pt-6 border-t border-gray-200 dark:border-gray-700">
      <div class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        Способы оплаты
      </div>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="method in sitter.paymentMethods"
          :key="method"
          class="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm"
        >
          {{ method }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Sitter } from '~/types/sitter'

defineProps<{
  sitter: Sitter
}>()

</script>

