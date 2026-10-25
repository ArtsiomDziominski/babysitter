<template>
  <div class="bg-default rounded-2xl shadow-lg border border-default p-6">
    <h3 class="text-lg font-semibold text-highlighted mb-4">
      {{ $t('bookings.sitter.stats.title') }}
    </h3>
    <div class="grid grid-cols-4 gap-4">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="flex flex-col items-center text-center p-3 bg-muted rounded-lg"
      >
        <div class="p-2 bg-primary/10 rounded-lg mb-2">
          <Icon :name="stat.icon" size="20" class="text-primary" />
        </div>
        <div :class="[stat.textSize, 'font-bold text-highlighted']">
          {{ stat.value }}
        </div>
        <div class="text-xs text-toned">{{ stat.label }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Sitter } from '~/types/sitter'

const { t } = useI18n()

const props = defineProps<{
  sitter: Sitter
}>()

const stats = computed(() => [
  {
    icon: 'i-lucide-shopping-bag',
    value: props.sitter.completedOrdersCount,
    label: t('bookings.sitter.stats.orders'),
    textSize: 'text-2xl'
  },
  {
    icon: 'i-lucide-clock',
    value: props.sitter.hours,
    label: t('bookings.sitter.stats.hours'),
    textSize: 'text-2xl'
  },
  {
    icon: 'i-lucide-repeat',
    value: props.sitter.returningCount || 0,
    label: t('bookings.sitter.stats.returned'),
    textSize: 'text-2xl'
  },
  {
    icon: 'i-lucide-message-circle',
    value: props.sitter.responseTime || t('bookings.sitter.stats.responseTimeDefault'),
    label: t('bookings.sitter.stats.response'),
    textSize: 'text-sm'
  }
])
</script>

