<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4">
    <UContainer>
      <div class="max-w-3xl mx-auto text-center">
        <div class="relative mb-8">
          <div class="text-[120px] md:text-[180px] font-bold text-primary-200 dark:text-primary-900/20 leading-none select-none">
            404
          </div>
          <div class="absolute inset-0 flex items-center justify-center">
            <Icon name="i-lucide-baby" class="w-24 h-24 md:w-32 md:h-32 text-primary-400 dark:text-primary-500 animate-bounce" />
          </div>
        </div>

        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          {{ $t('error404.title') }}
        </h1>

        <p class="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto">
          {{ $t('error404.description') }}
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <UButton
            color="primary"
            size="xl"
            to="/"
            icon="i-lucide-home"
            class="min-w-[200px]"
          >
            {{ $t('error404.backHome') }}
          </UButton>
          <UButton
            color="gray"
            variant="outline"
            size="xl"
            to="/search"
            icon="i-lucide-search"
            class="min-w-[200px]"
          >
            {{ $t('error404.findSitter') }}
          </UButton>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div class="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
            <Icon name="i-lucide-users" class="w-10 h-10 text-primary-500 mb-4 mx-auto" />
            <h3 class="font-semibold text-gray-900 dark:text-white mb-2">
              {{ $t('error404.card1.title') }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ $t('error404.card1.description') }}
            </p>
          </div>

          <div class="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
            <Icon name="i-lucide-shield-check" class="w-10 h-10 text-primary-500 mb-4 mx-auto" />
            <h3 class="font-semibold text-gray-900 dark:text-white mb-2">
              {{ $t('error404.card2.title') }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ $t('error404.card2.description') }}
            </p>
          </div>

          <div class="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
            <Icon name="i-lucide-heart-handshake" class="w-10 h-10 text-primary-500 mb-4 mx-auto" />
            <h3 class="font-semibold text-gray-900 dark:text-white mb-2">
              {{ $t('error404.card3.title') }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ $t('error404.card3.description') }}
            </p>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
defineProps({
  error: {
    type: Object,
    default: null
  }
})
</script>

<style scoped>
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.animate-bounce {
  animation: bounce 2s infinite;
}
</style>

