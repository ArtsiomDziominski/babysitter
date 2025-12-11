<template>
  <section class="py-16 bg-white dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800">
    <UContainer>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
        <div class="text-center">
          <div class="text-4xl lg:text-5xl font-bold text-primary-600 dark:text-primary-400 mb-2">500+</div>
          <div class="text-gray-600 dark:text-gray-400">{{ $t('home.stats.sitters') }}</div>
        </div>
        <div class="text-center">
          <div class="text-4xl lg:text-5xl font-bold text-primary-600 dark:text-primary-400 mb-2">2000+</div>
          <div class="text-gray-600 dark:text-gray-400">{{ $t('home.stats.families') }}</div>
        </div>
        <div class="text-center">
          <div class="text-4xl lg:text-5xl font-bold text-primary-600 dark:text-primary-400 mb-2">5000+</div>
          <div class="text-gray-600 dark:text-gray-400">{{ $t('home.stats.bookings') }}</div>
        </div>
        <div class="text-center">
          <div class="text-4xl lg:text-5xl font-bold text-primary-600 dark:text-primary-400 mb-2">4.9</div>
          <div class="text-gray-600 dark:text-gray-400">{{ $t('home.stats.rating') }}</div>
        </div>
      </div>
    </UContainer>
  </section>
</template>

