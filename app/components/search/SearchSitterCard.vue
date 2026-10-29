<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-4 lg:gap-6">
    <div
      v-for="sitter in sitters"
      :key="sitter.id"
      class="group bg-default rounded-xl border border-default hover:border-primary/40 hover:shadow-md transition overflow-hidden cursor-pointer"
      @click="$emit('book', sitter.id.toString())"
    >
      <div class="relative">
        <div class="w-full aspect-[4/3] bg-elevated overflow-hidden">
          <img
            v-if="sitter.avatarUrl"
            :src="sitter.avatarUrl"
            :alt="formatName(sitter.firstName, sitter.lastName)"
            class="w-full h-full object-cover group-hover:scale-[1.02] transition-transform"
          />
          <div
            v-else
            class="w-full h-full flex items-center justify-center text-dimmed"
          >
            <Icon name="i-lucide-user" size="48" />
          </div>
          <UBadge
              v-if="sitter.isOnline"
              :label="$t('bookings.sitter.online')"
              color="success"
              variant="solid"
              class="absolute top-3 right-3 rounded-full"
          />
          <SitterFavoriteButton
              :babysitter-id="sitter.id"
              class="absolute top-3 left-3"
          />
        </div>
      </div>

      <div class="p-4 max-xl:p-3">
        <h3 class="text-lg font-semibold text-highlighted mb-1 max-xl:text-base">
          {{ formatName(sitter.firstName, sitter.lastName) }}{{ getAge(sitter.birthDate) }}
        </h3>
        <div class="text-xl font-bold text-primary mb-3 max-xl:text-lg">
          {{ sitter.priceOneChild ? parseFloat(sitter.priceOneChild) : 0 }} {{ siteConfig.currency }}/час
        </div>

        <div class="flex flex-wrap gap-4 max-xl:gap-2 text-sm text-toned max-xl:text-xs">
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
      <p class="text-muted">
        {{ $t('bookings.empty') }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BabysitterListItem } from '~/composables/useBabysitter'

const siteConfig = useSiteConfig()

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
