<script setup lang="ts">
const { t } = useI18n()

const features = ['verified', 'safe', 'flexible', 'support']
</script>

<template>
  <section class="mt-20 bg-stone-900 text-white sm:mt-28 dark:bg-elevated">
    <UContainer class="flex flex-col gap-12 py-20 lg:flex-row lg:py-24">
      <div class="lg:w-1/3">
        <h2 class="font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
          {{ t('home.advantages.title') }}
        </h2>
        <p class="mt-4 text-lg text-stone-300">
          {{ t('home.advantages.subtitle') }}
        </p>
      </div>

      <ul class="grid flex-1 gap-x-10 gap-y-10 sm:grid-cols-2">
        <li v-for="key in features" :key="key">
          <span class="mb-4 block h-1 w-8 rounded-full bg-primary-500" aria-hidden="true" />
          <h3 class="text-lg font-bold">{{ t(`home.advantages.${key}.title`) }}</h3>
          <p class="mt-2 text-stone-300">{{ t(`home.advantages.${key}.description`) }}</p>
        </li>
      </ul>
    </UContainer>
  </section>
</template>
