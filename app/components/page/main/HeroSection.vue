<template>
  <section class="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 lg:py-32">
    <UContainer>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div class="space-y-8">
          <h1 class="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
            {{ $t('home.hero.title') }}
          </h1>
          <p class="text-xl text-gray-600 dark:text-gray-300">
            {{ $t('home.hero.subtitle') }}
          </p>
          <div class="flex flex-col sm:flex-row gap-4">
            <UButton size="xl" color="primary" class="px-8 py-6 text-lg">
              {{ $t('home.hero.cta') }}
            </UButton>
            <UButton size="xl" variant="outline" color="primary" class="px-8 py-6 text-lg">
              {{ $t('home.hero.ctaSecondary') }}
            </UButton>
          </div>
        </div>
        <div class="relative">
          <!-- Placeholder for hero image -->
          <div class="w-full h-[500px] rounded-2xl bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 dark:from-blue-800 dark:via-purple-800 dark:to-pink-800 flex items-center justify-center">
            <Icon name="mdi:image-outline" size="80" class="text-gray-400 dark:text-gray-500" />
          </div>
        </div>
      </div>
    </UContainer>
  </section>
</template>

