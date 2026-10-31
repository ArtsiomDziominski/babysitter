<template>
  <div
      class="relative bg-default border border-default rounded-xl p-5 max-xl:p-3 hover:border-primary/40 hover:shadow-md transition"
  >
    <div class="flex gap-6 max-xl:flex-col max-xl:gap-3">
      <div class="flex-shrink-0 flex flex-col max-xl:items-center max-xl:w-full">
        <div
            class="relative w-[140px] h-[140px] max-xl:w-full max-xl:max-w-none max-xl:h-auto max-xl:aspect-[4/3] bg-elevated rounded-xl overflow-hidden cursor-pointer"
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
              class="text-dimmed absolute inset-0 m-auto"
          />
          <UBadge
              v-if="sitter.isOnline"
              :label="$t('bookings.sitter.online')"
              color="success"
              variant="solid"
              size="sm"
              class="absolute top-2 left-2 rounded-full"
          />
          <SitterFavoriteButton
              :babysitter-id="sitter.id"
              :size="16"
              class="absolute top-2 right-2 p-1.5"
          />
        </div>
        <div v-if="sitter.city || sitter.distanceKm != null"
             class="flex items-center justify-center gap-1 mt-2 text-xs text-muted">
          <Icon name="i-lucide-map-pin" size="12"/>
          <span>{{ [sitter.city ? getCityName(sitter.city) : '', formatDistance(sitter.distanceKm)].filter(Boolean).join(' · ') }}</span>
        </div>
      </div>

      <div class="flex-1 min-w-0 max-xl:w-full">
        <div class="flex items-start justify-between mb-2 max-xl:flex-col max-xl:gap-2">
          <div class="flex-1 min-w-0">
            <h3 class="text-xl max-xl:text-lg font-semibold text-highlighted cursor-pointer break-words"
                @click="$emit('book', sitter.id.toString())">
              {{ getName(sitter.firstName, sitter.lastName ? `${sitter.lastName[0]}.` : '') }}
            </h3>
            <div class="flex items-center gap-2 mt-1 max-xl:flex-wrap max-xl:text-xs">
              <div class="flex items-center">
                <UIcon name="i-mdi-star" class="size-4 text-amber-400"/>
                <span class="ml-1 text-sm max-xl:text-xs font-medium text-default">
                  {{ sitter.rating ? parseFloat(sitter.rating) : 0 }}
                </span>
              </div>
              <span class="text-sm max-xl:text-xs text-muted">
                {{ sitter.completedOrdersCount || 0 }} {{ $t('bookings.sitter.orders') }}
              </span>
              <span v-if="sitter.returningCount"
                    class="text-sm max-xl:text-xs text-muted flex items-center gap-1 cursor-default">
                <UTooltip :text="$t('bookings.sitter.returnedTooltip')">
                  <Icon name="i-lucide-repeat" size="14" class="max-xl:w-3 max-xl:h-3"/>
                  <span> {{ sitter.returningCount }} {{ $t('bookings.sitter.returned') }} </span>
                </UTooltip>
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

        <p class="text-toned mb-4 max-xl:mb-3 max-xl:text-sm line-clamp-2 break-words">
          {{ sitter.bio || '' }}
        </p>

        <div class="flex flex-wrap gap-2 mb-4 max-xl:mb-3">
          <UBadge color="neutral" variant="soft" icon="i-lucide-briefcase">
            {{ $t('bookings.sitter.experience') }} {{ sitter.experience }} {{ yearWord }}
          </UBadge>
        </div>

        <div class="flex flex-wrap gap-2 mb-4 max-xl:mb-3">
          <UBadge
              v-for="advantage in displayedAdvantages"
              :key="advantage"
              :label="advantage"
              variant="subtle"
          />
        </div>

        <div class="flex flex-wrap gap-2 mb-4 max-xl:mb-3">
          <UBadge
              v-for="tag in sitter.certifications"
              :key="tag"
              :label="tag"
              color="neutral"
              variant="outline"
          />
        </div>

        <UButton
            color="primary"
            size="lg"
            trailing-icon="i-lucide-arrow-right"
            class="absolute right-5 bottom-5 max-xl:!relative max-xl:!right-auto max-xl:!bottom-auto max-xl:!static max-xl:w-full max-xl:mt-2 max-xl:mb-0 cursor-pointer"
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
const { formatDistance } = useDistance()

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

