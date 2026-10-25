<script setup lang="ts">
const { t } = useI18n()

const stats = [
  { value: '500+', key: 'sitters' },
  { value: '2000+', key: 'families' },
  { value: '5000+', key: 'bookings' },
  { value: '4.9', key: 'rating' }
]
</script>

<template>
  <UContainer>
    <dl class="grid grid-cols-2 lg:grid-cols-4 gap-px overflow-hidden rounded-2xl border border-default bg-(--ui-border)">
      <div v-for="stat in stats" :key="stat.key" class="bg-default px-6 py-8 text-center">
        <dt class="text-sm text-muted">{{ t(`home.stats.${stat.key}`) }}</dt>
        <dd class="mt-2 text-3xl lg:text-4xl font-bold tracking-tight text-highlighted">{{ stat.value }}</dd>
      </div>
    </dl>
  </UContainer>
</template>
