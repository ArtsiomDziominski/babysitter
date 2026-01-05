<template>
  <div
      class="relative border border-gray-200 dark:border-gray-700 rounded-lg p-6 max-xl:p-3 hover:shadow-md transition-shadow"
  >
    <div class="flex gap-6 max-xl:flex-col max-xl:gap-3">
      <div class="flex-shrink-0 flex flex-col max-xl:items-center max-xl:w-full">
        <div
            class="relative w-[140px] h-[140px] max-xl:w-full max-xl:max-w-none max-xl:h-auto max-xl:aspect-square bg-gray-200 dark:bg-gray-700 rounded-xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer"
             @click="$emit('book', sitter.id.toString())"
        >
          <img
            v-if="sitter.avatarUrl"
            :src="sitter.avatarUrl"
            :alt="getName(sitter.firstName, sitter.lastName)"
            class="w-full h-full object-cover"
          />
          <Icon
            v-else
            name="i-lucide-user"
            size="48"
            class="text-gray-400 absolute inset-0 m-auto"
          />
          <div
              v-if="sitter.isOnline"
              class="absolute top-2 left-2 flex items-center gap-1.5"
          >
            <span class="w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></span>
            <span class="text-xs text-green-600 dark:text-green-400 font-medium">{{ $t('bookings.sitter.online') }}</span>
          </div>
        </div>
        <div v-if="sitter.city" class="flex items-center justify-center gap-1 mt-2 text-xs text-gray-500 dark:text-gray-400">
          <Icon name="i-lucide-map-pin" size="12" />
          <span>{{ getCityName(sitter.city) }}</span>
        </div>
      </div>

      <div class="flex-1 min-w-0 max-xl:w-full">
        <div class="flex items-start justify-between mb-2 max-xl:flex-col max-xl:gap-2">
          <div class="flex-1 min-w-0">
            <h3 class="text-xl max-xl:text-lg font-semibold text-gray-900 dark:text-white cursor-pointer break-words"
                @click="$emit('book', sitter.id.toString())">
              {{ getName(sitter.firstName, sitter.lastName?.[0] + '.') }}
            </h3>
            <div class="flex items-center gap-2 mt-1 max-xl:flex-wrap max-xl:text-xs">
              <div class="flex items-center">
                <Icon name="i-lucide-star" class="text-yellow-400 max-xl:w-3 max-xl:h-3"/>
                <span class="ml-1 text-sm max-xl:text-xs font-medium text-gray-700 dark:text-gray-300">
                  {{ sitter.rating ? parseFloat(sitter.rating) : 0 }}
                </span>
              </div>
              <span class="text-sm max-xl:text-xs text-gray-500 dark:text-gray-400">
                {{ sitter.reviewsCount || 0 }} {{ $t('bookings.sitter.orders') }}
              </span>
              <span v-if="sitter.returningCount" class="text-sm max-xl:text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Icon name="i-lucide-repeat" size="14" class="max-xl:w-3 max-xl:h-3"/>
                {{ sitter.returningCount }} {{ $t('bookings.sitter.returned') }}
              </span>
            </div>
          </div>
          <div class="text-right max-xl:w-full max-xl:text-left">
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

        <p class="text-gray-600 dark:text-gray-400 mb-4 max-xl:mb-3 max-xl:text-sm line-clamp-2 break-words">
          {{ sitter.bio || '' }}
        </p>

        <div class="flex flex-wrap gap-2 mb-4 max-xl:mb-3">
          <span class="px-2 py-1 text-xs max-xl:text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded break-words">
            {{ $t('bookings.sitter.experience') }} {{ sitter.experience }} {{ yearWord }}
          </span>
        </div>

        <div class="flex flex-wrap gap-2 mb-4 max-xl:mb-3">
          <span
              v-for="advantage in displayedAdvantages"
              :key="advantage"
              class="px-2 py-1 text-xs max-xl:text-[10px] bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded break-words"
          >
            {{ advantage }}
          </span>
        </div>

        <div class="flex flex-wrap gap-2 mb-4 max-xl:mb-3">
          <span
              v-for="tag in sitter.certifications"
              :key="tag"
              class="px-2 py-1 text-xs max-xl:text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded break-words"
          >
            {{ tag }}
          </span>
        </div>

        <UButton
            color="primary"
            size="lg"
            class="absolute right-6 bottom-6 max-xl:!relative max-xl:!right-auto max-xl:!bottom-auto max-xl:!static max-xl:w-full max-xl:mt-2 max-xl:mb-0 cursor-pointer"
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
import { useAdvantages } from '~/composables/useAdvantages'

const props = defineProps<{
  sitter: BabysitterListItem
}>()

defineEmits<{
  book: [sitterId: string | number]
}>()

const { t } = useI18n()
const { getDisplayedAdvantages } = useAdvantages()

const displayedAdvantages = computed(() => getDisplayedAdvantages(props.sitter.advantages))

const getName = (firstName?: string, lastName?: string) => {
  return `${ firstName || '' } ${ lastName || '' }`.trim() || t('bookings.sitter.noName')
}

const yearWord = computed(() => {
  const years = props.sitter.experience || 0
  const mod10 = years % 10
  const mod100 = years % 100

  if (mod10 === 1 && mod100 !== 11) {
    return t('bookings.sitter.year')
  } else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
    return t('bookings.sitter.years2to4')
  } else {
    return t('bookings.sitter.years')
  }
})

const getCityName = (cityKey: string) => {
  try {
    return t(`cities.${ cityKey }`)
  } catch {
    return cityKey
  }
}
</script>

