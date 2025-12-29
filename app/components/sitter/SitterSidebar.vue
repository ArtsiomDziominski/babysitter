<template>
  <div class="sticky top-6 space-y-6">
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <div class="text-center mb-6">
        <div class="text-4xl font-bold text-gray-900 dark:text-white mb-1">
          {{ sitter.price }} {{ siteConfig.currency }}
        </div>
        <div class="text-sm text-gray-500 dark:text-gray-400">за час</div>
      </div>

      <div class="space-y-3 mb-6">
        <UButton
          color="primary"
          size="lg"
          block
          class="font-semibold"
          @click="$emit('contact')"
        >
          <Icon name="i-lucide-phone" size="20" class="mr-2" />
          Позвать
        </UButton>
        <UButton
          variant="outline"
          size="lg"
          block
          class="font-semibold"
          @click="$emit('message')"
        >
          <Icon name="i-lucide-message-circle" size="20" class="mr-2" />
          Написать
        </UButton>
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

    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Статистика
      </h3>
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-primary/10 rounded-lg">
              <Icon name="i-lucide-shopping-bag" size="20" class="text-primary-500" />
            </div>
            <div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Заказов</div>
              <div class="text-lg font-bold text-gray-900 dark:text-white">{{ sitter.orders }}</div>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-primary/10 rounded-lg">
              <Icon name="i-lucide-clock" size="20" class="text-primary-500" />
            </div>
            <div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Часов</div>
              <div class="text-lg font-bold text-gray-900 dark:text-white">{{ sitter.hours }}</div>
            </div>
          </div>
        </div>

        <div v-if="sitter.returningCount !== undefined && sitter.returningCount !== null" class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-primary/10 rounded-lg">
              <Icon name="i-lucide-repeat" size="20" class="text-primary-500" />
            </div>
            <div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Вернулись</div>
              <div class="text-lg font-bold text-gray-900 dark:text-white">{{ sitter.returningCount }}</div>
            </div>
          </div>
        </div>

        <div v-if="sitter.responseTime" class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-primary/10 rounded-lg">
              <Icon name="i-lucide-message-circle" size="20" class="text-primary-500" />
            </div>
            <div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Ответ</div>
              <div class="text-lg font-bold text-gray-900 dark:text-white">{{ sitter.responseTime }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="sitter.experience || sitter.education" class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Информация
      </h3>
      <div class="space-y-3">
        <div v-if="sitter.experience" class="flex items-start gap-3">
          <Icon name="i-lucide-briefcase" size="18" class="text-primary-500 mt-0.5 flex-shrink-0" />
          <div>
            <div class="text-sm font-medium text-gray-900 dark:text-white">Опыт</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">{{ sitter.experience }}</div>
          </div>
        </div>
        <div v-if="sitter.education" class="flex items-start gap-3">
          <Icon name="i-lucide-graduation-cap" size="18" class="text-primary-500 mt-0.5 flex-shrink-0" />
          <div>
            <div class="text-sm font-medium text-gray-900 dark:text-white">Образование</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">{{ sitter.education }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Sitter } from '~/types/sitter'

const siteConfig = useSiteConfig()

defineProps<{
  sitter: Sitter
}>()

defineEmits<{
  contact: []
  message: []
}>()
</script>

