<template>
  <section class="py-20 bg-white dark:bg-gray-900">
    <UContainer>
      <div class="flex justify-between items-center mb-12">
        <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
          {{ $t('home.reviews.title') }}
        </h2>
        <UButton variant="ghost" color="primary">
          {{ $t('home.reviews.more') }}
        </UButton>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div v-for="i in 3" :key="i" class="p-6 rounded-xl bg-gray-50 dark:bg-gray-800 space-y-4">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-full bg-gradient-to-br from-blue-200 to-purple-200 dark:from-blue-800 dark:to-purple-800 flex items-center justify-center">
              <Icon name="mdi:account" size="32" class="text-gray-400 dark:text-gray-500" />
            </div>
            <div>
              <div class="font-semibold text-gray-900 dark:text-white">Анна К.</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Минск</div>
            </div>
          </div>
          <div class="flex gap-1 text-yellow-400">
            <Icon v-for="star in 5" :key="star" name="mdi:star" size="20" />
          </div>
          <p class="text-gray-600 dark:text-gray-400">
            Отличный сервис! Нашли замечательную бебиситтер для нашего сына. Всё прошло идеально, ребёнок был в восторге.
          </p>
        </div>
      </div>
    </UContainer>
  </section>
</template>

