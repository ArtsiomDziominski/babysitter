<template>
  <section class="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 lg:py-32">
    <UContainer>
      <div class="max-w-3xl mx-auto text-center">
        <div class="space-y-8">
          <h1 class="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
            {{ $t('home.hero.title') }}
          </h1>
          <p class="text-xl text-gray-600 dark:text-gray-300">
            {{ $t('home.hero.subtitle') }}
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <UButton size="xl" color="primary" class="px-8 py-6 text-lg" to="/search">
              {{ $t('home.hero.cta') }}
            </UButton>
            <!-- <UButton size="xl" variant="outline" color="primary" class="px-8 py-6 text-lg">
              {{ $t('home.hero.ctaSecondary') }}
            </UButton> -->
          </div>
        </div>
      </div>
    </UContainer>
  </section>
</template>

