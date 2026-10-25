<script setup lang="ts">
const { t } = useI18n()

const advantages = [
  { key: 'verified', icon: 'mdi:shield-check', color: 'bg-success-100 dark:bg-success-900/30 text-success-600 dark:text-success-400' },
  { key: 'safe', icon: 'mdi:lock-outline', color: 'bg-info-100 dark:bg-info-900/30 text-info-600 dark:text-info-400' },
  { key: 'flexible', icon: 'mdi:clock-outline', color: 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400' },
  { key: 'support', icon: 'mdi:headset', color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' }
]
</script>

<template>
  <section class="py-20 lg:py-28 bg-muted">
    <UContainer>
      <div v-reveal class="text-center mb-16">
        <h2 class="text-3xl lg:text-4xl font-bold text-highlighted mb-4">
          {{ t('home.advantages.title') }}
        </h2>
        <p class="text-lg text-toned max-w-2xl mx-auto">
          {{ t('home.advantages.subtitle') }}
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="(advantage, i) in advantages"
          :key="advantage.key"
          v-reveal="i * 100"
          class="group p-6 rounded-2xl bg-default border border-default hover:border-primary-200 dark:hover:border-primary-800 hover:shadow-lg hover:shadow-primary-100/50 dark:hover:shadow-primary-900/20 transition-all duration-300"
        >
          <div :class="['w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300', advantage.color]">
            <Icon :name="advantage.icon" size="28" />
          </div>
          <h3 class="text-lg font-semibold text-highlighted mb-2">
            {{ t(`home.advantages.${advantage.key}.title`) }}
          </h3>
          <p class="text-toned text-sm leading-relaxed">
            {{ t(`home.advantages.${advantage.key}.description`) }}
          </p>
        </div>
      </div>
    </UContainer>
  </section>
</template>
