<script setup lang="ts">
const { t } = useI18n()

const steps = [
  { key: 'step1', icon: 'mdi:account-search-outline', color: 'bg-info-100 dark:bg-info-900/40 text-info-600 dark:text-info-400' },
  { key: 'step2', icon: 'mdi:card-account-details-star-outline', color: 'bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400' },
  { key: 'step3', icon: 'mdi:handshake-outline', color: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400' }
]
</script>

<template>
  <section class="py-20 lg:py-28 bg-muted">
    <UContainer>
      <div v-reveal class="text-center mb-16">
        <h2 class="text-3xl lg:text-4xl font-bold text-highlighted mb-4">
          {{ t('home.howItWorks.title') }}
        </h2>
        <p class="text-lg text-toned max-w-2xl mx-auto">
          {{ t('home.howItWorks.subtitle') }}
        </p>
      </div>

      <div class="relative grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
        <div class="hidden md:block absolute top-16 left-[20%] right-[20%] h-0.5 border-t-2 border-dashed border-accented" />

        <div
          v-for="(step, index) in steps"
          :key="step.key"
          v-reveal="index * 150"
          class="relative text-center"
        >
          <div class="relative inline-flex items-center justify-center mb-6">
            <div :class="['w-20 h-20 lg:w-24 lg:h-24 rounded-2xl flex items-center justify-center shadow-sm', step.color]">
              <Icon :name="step.icon" class="w-10 h-10 lg:w-12 lg:h-12" />
            </div>
            <div class="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-bold shadow-lg">
              {{ index + 1 }}
            </div>
          </div>
          <h3 class="text-xl font-semibold text-highlighted mb-2">
            {{ t(`home.howItWorks.${step.key}.title`) }}
          </h3>
          <p class="text-toned max-w-xs mx-auto">
            {{ t(`home.howItWorks.${step.key}.description`) }}
          </p>
        </div>
      </div>
    </UContainer>
  </section>
</template>
