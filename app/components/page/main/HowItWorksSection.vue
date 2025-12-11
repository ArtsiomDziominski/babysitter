<script setup lang="ts">
const steps = [
  { key: 'step1', icon: 'mdi:account-search' },
  { key: 'step2', icon: 'mdi:calendar-check' },
  { key: 'step3', icon: 'mdi:handshake' },
  { key: 'step4', icon: 'mdi:heart' }
]
</script>

<template>
  <section class="py-20 bg-gray-50 dark:bg-gray-800">
    <UContainer>
      <h2 class="text-3xl lg:text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
        {{ $t('home.howItWorks.title') }}
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div v-for="(step, index) in steps" :key="step.key" class="text-center space-y-4">
          <div class="relative inline-flex items-center justify-center">
            <div class="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
              <Icon :name="step.icon" size="40" class="text-primary-600 dark:text-primary-400" />
            </div>
            <div class="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary-600 dark:bg-primary-400 text-white flex items-center justify-center font-bold">
              {{ index + 1 }}
            </div>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
            {{ $t(`home.howItWorks.${step.key}.title`) }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            {{ $t(`home.howItWorks.${step.key}.description`) }}
          </p>
        </div>
      </div>
    </UContainer>
  </section>
</template>

