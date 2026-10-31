<template>
  <div
      :data-sitter-id="sitter.id"
      class="flex gap-3 items-center rounded-xl border bg-default p-3 cursor-pointer transition"
      :class="active ? 'border-primary shadow-md' : 'border-default hover:border-primary/40'"
      @click="$emit('book', sitter.id)"
  >
    <div class="relative size-16 shrink-0 rounded-lg overflow-hidden bg-elevated">
      <img
          v-if="sitter.avatarUrl"
          :src="sitter.avatarUrl"
          :alt="name"
          class="w-full h-full object-cover"
      />
      <Icon v-else name="i-lucide-user" size="28" class="text-dimmed absolute inset-0 m-auto"/>
    </div>
    <div class="flex-1 min-w-0">
      <p class="font-semibold text-highlighted truncate">{{ name }}</p>
      <div class="flex items-center gap-2 text-sm text-muted">
        <span class="flex items-center">
          <UIcon name="i-mdi-star" class="size-4 text-amber-400"/>
          <span class="ml-1 text-default">{{ sitter.rating ? parseFloat(sitter.rating) : 0 }}</span>
        </span>
        <span v-if="price != null">{{ price }} {{ siteConfig.currency }}</span>
      </div>
      <p v-if="sitter.distanceKm != null || sitter.city" class="flex items-center gap-1 text-xs text-muted mt-0.5">
        <Icon name="i-lucide-map-pin" size="12"/>
        <span class="truncate">{{ location }}</span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BabysitterListItem } from '~/composables/useBabysitter'

const props = defineProps<{
  sitter: BabysitterListItem
  active?: boolean
}>()

defineEmits<{
  book: [sitterId: string | number]
}>()

const { t } = useI18n()
const siteConfig = useSiteConfig()
const { formatDistance } = useDistance()

const name = computed(() => {
  const lastInitial = props.sitter.lastName ? `${ props.sitter.lastName[0] }.` : ''
  return `${ props.sitter.firstName || '' } ${ lastInitial }`.trim() || t('bookings.sitter.noName')
})

const price = computed(() => props.sitter.priceOneChild ? parseFloat(props.sitter.priceOneChild) : null)

const location = computed(() =>
    [props.sitter.city ? t(`cities.${ props.sitter.city }`) : '', formatDistance(props.sitter.distanceKm)]
        .filter(Boolean)
        .join(' · ')
)
</script>
