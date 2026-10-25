<script setup lang="ts">
const { t } = useI18n()

const stats = [
  { value: '500+', key: 'sitters', icon: 'mdi:account-group' },
  { value: '2000+', key: 'families', icon: 'mdi:home-heart' },
  { value: '5000+', key: 'bookings', icon: 'mdi:calendar-check' },
  { value: '4.9', key: 'rating', icon: 'mdi:star' }
]
</script>

<template>
  <section class="py-16 bg-default border-y border-default">
    <UContainer>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
        <div
          v-for="(stat, i) in stats"
          :key="stat.key"
          v-reveal="i * 100"
          class="text-center space-y-2"
        >
          <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/40 mb-2">
            <Icon :name="stat.icon" size="24" class="text-primary" />
          </div>
          <div class="text-3xl lg:text-4xl font-bold text-highlighted">
            {{ stat.value }}
          </div>
          <div class="text-sm text-muted font-medium">
            {{ t(`home.stats.${stat.key}`) }}
          </div>
        </div>
      </div>
    </UContainer>
  </section>
</template>
