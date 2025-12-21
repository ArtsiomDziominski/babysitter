<template>
  <div
      class="relative border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow"
  >
    <div class="flex gap-6">
      <div class="flex-shrink-0 flex flex-col">
        <div
            class="relative w-[140px] h-[140px] bg-gray-200 dark:bg-gray-700 rounded-xl border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center cursor-pointer"
             @click="$emit('book', sitter.id.toString())"
        >
          <Icon name="i-lucide-user" size="48" class="text-gray-400"/>
          <div
              v-if="sitter.isOnline"
              class="absolute top-2 left-2 flex items-center gap-1.5"
          >
            <span class="w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></span>
            <span class="text-xs text-green-600 dark:text-green-400 font-medium">Онлайн</span>
          </div>
        </div>
      </div>

      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between mb-2">
          <div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white cursor-pointer"
                @click="$emit('book', sitter.id.toString())">
              {{ getName(sitter.firstName, sitter.lastName) }}
            </h3>
            <div class="flex items-center gap-2 mt-1">
              <div class="flex items-center">
                <Icon name="i-lucide-star" class="text-yellow-400"/>
                <span class="ml-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ sitter.rating ? parseFloat(sitter.rating) : 0 }}
                </span>
              </div>
              <span class="text-sm text-gray-500 dark:text-gray-400">
                {{ sitter.reviewsCount || 0 }} {{ $t('bookings.sitter.orders') }}
              </span>
            </div>
          </div>
          <div class="text-right">
            <SearchPriceMenu
                :price-one-child="sitter.priceOneChild"
                :price-two-children="sitter.priceTwoChildren"
                :price-three-children="sitter.priceThreeChildren"
                :online-lesson="sitter.onlineLesson"
                :min-order-amount="sitter.minOrderAmount"
                @click.stop="$emit('book', sitter.id.toString())"
            />
          </div>
        </div>

        <p class="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {{ sitter.bio || '' }}
        </p>

        <div class="flex flex-wrap gap-2 mb-4">
          <span class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
            Опыт {{ sitter.experience }} {{ yearWord }}
          </span>
        </div>

        <div class="flex flex-wrap gap-2 mb-4">
          <span
              v-for="advantage in sitter.advantages"
              :key="advantage"
              class="px-2 py-1 text-xs bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded"
          >
            {{ advantage }}
          </span>
        </div>

        <div class="flex flex-wrap gap-2 mb-4">
          <span
              v-for="tag in sitter.certifications"
              :key="tag"
              class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
          >
            {{ tag }}
          </span>
        </div>

        <UButton
            color="primary"
            size="lg"
            class="absolute right-6 bottom-6 cursor-pointer"
            @click="$emit('book', sitter.id.toString())"
        >
          {{ $t('bookings.sitter.details') }}
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BabysitterListItem } from '~/composables/useBabysitter'

const props = defineProps<{
  sitter: BabysitterListItem
}>()

defineEmits<{
  book: [sitterId: string | number]
}>()

const getName = (firstName?: string, lastName?: string) => {
  return `${ firstName || '' } ${ lastName || '' }`.trim() || 'Без имени'
}

const yearWord = computed(() => {
  const years = props.sitter.experience || 0
  const mod10 = years % 10
  const mod100 = years % 100

  if (mod10 === 1 && mod100 !== 11) {
    return 'год'
  } else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
    return 'года'
  } else {
    return 'лет'
  }
})
</script>
