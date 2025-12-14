<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
    <div
      v-for="sitter in sitters"
      :key="sitter.id"
      class="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
      @click="$emit('book', sitter.id)"
    >
      <div class="relative">
        <div class="w-[246px] h-[256px] bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <img
            v-if="sitter.avatar"
            :src="sitter.avatar"
            :alt="sitter.name"
            class="w-[246px] h-[256px] object-cover"
          />
          <div
            v-else
            class="w-[246px] h-[256px] flex items-center justify-center text-gray-400"
          >
            <Icon name="i-lucide-user" size="48" />
          </div>
        </div>

        <div
          v-if="sitter.isOnline"
          class="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs flex items-center gap-1"
        >
          <div class="w-2 h-2 bg-green-400 rounded-full"></div>
          Ситтер онлайн
        </div>

        <div
          v-if="sitter.isOnline"
          class="absolute top-2 right-2 bg-green-500 rounded-full p-2"
        >
          <Icon name="i-lucide-headphones" size="16" class="text-white" />
        </div>

        <div
          v-if="sitter.isNew"
          class="absolute top-2 left-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs px-2 py-1 rounded"
        >
          Новый бебиситтер
        </div>
      </div>

      <div class="p-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          {{ formatName(sitter.name) }}{{ getAge(sitter) }}
        </h3>
        <div class="text-xl font-bold text-gray-900 dark:text-white mb-3">
          {{ sitter.price }} ₽/час
        </div>

        <div class="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div class="flex items-center gap-1">
            <Icon name="i-lucide-shopping-bag" size="16" />
            <span>{{ sitter.orders }} Заказа</span>
          </div>
          <div class="flex items-center gap-1">
            <Icon name="i-lucide-clock" size="16" />
            <span>{{ sitter.hours }} Часов с детьми</span>
          </div>
          <div class="flex items-center gap-1">
            <Icon name="i-lucide-repeat" size="16" />
            <span>{{ getReturningClients(sitter) }} Вернулся</span>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="sitters.length === 0"
      class="col-span-full text-center py-12"
    >
      <p class="text-gray-500 dark:text-gray-400">
        {{ $t('bookings.empty') }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Sitter } from '~/types/sitter'

defineProps<{
  sitters: Sitter[]
}>()

defineEmits<{
  book: [sitterId: string]
}>()

const formatName = (name: string) => {
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return `${parts[0]} ${parts[1][0]}.`
  }
  return name
}

const getAge = (sitter: Sitter) => {
  return ', 21 год'
}

const getReturningClients = (sitter: Sitter) => {
  return Math.floor(sitter.orders * 0.1) || 1
}
</script>
