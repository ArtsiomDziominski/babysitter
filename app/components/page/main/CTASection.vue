<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <section class="relative py-20 lg:py-28 overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-violet-700 dark:from-primary-800 dark:via-primary-900 dark:to-violet-900" />
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
    </div>

    <UContainer class="relative">
      <div v-reveal class="max-w-3xl mx-auto text-center space-y-8">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/90 text-sm font-medium backdrop-blur-sm">
          <Icon name="mdi:heart-outline" size="18" />
          {{ t('home.cta.badge') }}
        </div>

        <h2 class="text-3xl lg:text-5xl font-bold text-white leading-tight">
          {{ t('home.cta.title') }}
        </h2>

        <p class="text-lg lg:text-xl text-primary-100/80 max-w-xl mx-auto">
          {{ t('home.cta.subtitle') }}
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <UButton
            to="/register"
            size="xl"
            color="neutral"
            variant="solid"
            class="px-8 py-4 text-lg font-semibold hover:-translate-y-0.5 transition-all duration-300 shadow-xl"
          >
            <Icon name="mdi:account-plus" size="22" />
            {{ t('home.cta.ctaBabysitter') }}
          </UButton>
          <UButton
            to="/search"
            size="xl"
            variant="outline"
            class="px-8 py-4 text-lg font-semibold text-white border-white/30 hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-300"
          >
            {{ t('home.cta.ctaParent') }}
          </UButton>
        </div>
      </div>
    </UContainer>
  </section>
</template>
