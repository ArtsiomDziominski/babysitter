<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
    <div
      v-for="sitter in sitters"
      :key="sitter.id"
      class="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
      @click="$emit('book', sitter.id.toString())"
    >
      <div class="relative">
        <div class="w-[246px] h-[256px] max-xl:w-full max-xl:aspect-[246/256] bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <img
            v-if="sitter.avatarUrl"
            :src="sitter.avatarUrl"
            :alt="formatName(sitter.firstName, sitter.lastName)"
            class="w-full h-full object-cover"
          />
          <div
            v-else
            class="w-full h-full flex items-center justify-center text-gray-400"
          >
            <Icon name="i-lucide-user" size="48" />
          </div>
          <div
              v-if="sitter.isOnline"
              class="absolute top-2 right-2 flex items-center gap-1.5"
          >
            <span class="w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></span>
            <span class="text-xs text-green-600 dark:text-green-400 font-medium">Онлайн</span>
          </div>
        </div>
      </div>

      <div class="p-4 max-xl:p-3">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1 max-xl:text-base">
          {{ formatName(sitter.firstName, sitter.lastName) }}{{ getAge(sitter.birthDate) }}
        </h3>
        <div class="text-xl font-bold text-gray-900 dark:text-white mb-3 max-xl:text-lg">
          {{ sitter.priceOneChild ? parseFloat(sitter.priceOneChild) : 0 }} ₽/час
        </div>

        <div class="flex flex-wrap gap-4 max-xl:gap-2 text-sm text-gray-600 dark:text-gray-400 max-xl:text-xs">
          <div class="flex items-center gap-1">
            <Icon name="i-lucide-shopping-bag" size="16" />
            <span>{{ sitter.reviewsCount || 0 }} Заказа</span>
          </div>
          <div class="flex items-center gap-1">
            <Icon name="i-lucide-repeat" size="16" />
            <span>{{ sitter.returningCount || 0 }} {{ $t('bookings.sitter.returned') }}</span>
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
import type { BabysitterListItem } from '~/composables/useBabysitter'

defineProps<{
  sitters: BabysitterListItem[]
}>()

defineEmits<{
  book: [sitterId: string | number]
}>()

const formatName = (firstName?: string, lastName?: string) => {
  if (!firstName && !lastName) return 'Без имени'
  if (!lastName) return firstName || ''
  return `${firstName || ''} ${lastName[0]}.`
}

const getAge = (birthDate?: string) => {
  if (!birthDate) return ''
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  const yearWord = age === 1 ? 'год' : age < 5 ? 'года' : 'лет'
  return `, ${age} ${yearWord}`
}

</script>
