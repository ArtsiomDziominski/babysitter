<template>
  <section class="py-20 bg-gradient-to-r from-primary-600 to-purple-600 dark:from-primary-700 dark:to-purple-700">
    <UContainer>
      <div class="text-center space-y-8">
        <h2 class="text-3xl lg:text-4xl font-bold text-white">
          {{ $t('home.cta.title') }}
        </h2>
        <p class="text-xl text-primary-100">
          {{ $t('home.cta.subtitle') }}
        </p>
        <UButton size="xl" variant="solid" class="px-8 py-6 text-lg bg-white text-primary-600 hover:bg-gray-100">
          {{ $t('home.hero.cta') }}
        </UButton>
      </div>
    </UContainer>
  </section>
</template>

