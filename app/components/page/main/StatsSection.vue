<script setup lang="ts">
const { t } = useI18n()

const stats = computed(() => [
  { value: '500+', label: t('home.stats.sitters') },
  { value: '2000+', label: t('home.stats.families') },
  { value: '5000+', label: t('home.stats.bookings') },
  { value: '24/7', label: t('home.hero.trustSupport') }
])
</script>

<template>
  <UContainer class="pt-4">
    <dl class="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <div
        v-for="stat in stats"
        :key="stat.value"
        class="flex flex-col gap-1 rounded-3xl bg-default px-6 py-5 sm:flex-row sm:items-center sm:gap-4"
      >
        <dt class="order-2 text-sm text-muted">{{ stat.label }}</dt>
        <dd class="order-1 font-display text-2xl font-semibold text-highlighted sm:text-3xl">{{ stat.value }}</dd>
      </div>
    </dl>
  </UContainer>
</template>
