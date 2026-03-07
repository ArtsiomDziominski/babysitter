<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <section class="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 pt-20 pb-28 lg:pt-28 lg:pb-36">
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-24 -left-24 w-96 h-96 bg-primary-200/30 dark:bg-primary-800/10 rounded-full blur-3xl" />
      <div class="absolute -bottom-24 -right-24 w-[500px] h-[500px] bg-pink-200/20 dark:bg-pink-800/10 rounded-full blur-3xl" />
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-100/20 dark:bg-violet-900/5 rounded-full blur-3xl" />
    </div>

    <UContainer class="relative">
      <div class="max-w-4xl mx-auto text-center space-y-8">
        <div class="hero-fade-in inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100/80 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 text-sm font-medium backdrop-blur-sm border border-primary-200/50 dark:border-primary-800/30">
          <Icon name="mdi:shield-check-outline" size="18" />
          {{ t('home.hero.trusted') }}
        </div>

        <h1 class="hero-fade-in hero-delay-1 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-gray-900 dark:text-white leading-[1.1] tracking-tight">
          {{ t('home.hero.title') }}
        </h1>

        <p class="hero-fade-in hero-delay-2 text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          {{ t('home.hero.subtitle') }}
        </p>

        <div class="hero-fade-in hero-delay-3 flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <UButton
            to="/search"
            size="xl"
            color="primary"
            class="group px-8 py-4 text-lg font-semibold shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-0.5 transition-all duration-300"
          >
            <Icon name="mdi:magnify" size="22" class="group-hover:scale-110 transition-transform" />
            {{ t('home.hero.cta') }}
          </UButton>
          <UButton
            to="/register"
            size="xl"
            variant="outline"
            color="neutral"
            class="px-8 py-4 text-lg font-semibold hover:-translate-y-0.5 transition-all duration-300"
          >
            <Icon name="mdi:account-plus-outline" size="22" />
            {{ t('home.hero.ctaSecondary') }}
          </UButton>
        </div>

        <div class="hero-fade-in hero-delay-4 flex flex-wrap justify-center gap-x-8 gap-y-3 pt-8 text-sm text-gray-500 dark:text-gray-400">
          <span class="flex items-center gap-1.5">
            <Icon name="mdi:check-decagram" size="18" class="text-green-500" />
            {{ t('home.hero.trustVerified') }}
          </span>
          <span class="flex items-center gap-1.5">
            <Icon name="mdi:currency-usd-off" size="18" class="text-green-500" />
            {{ t('home.hero.trustFree') }}
          </span>
          <span class="flex items-center gap-1.5">
            <Icon name="mdi:headset" size="18" class="text-green-500" />
            {{ t('home.hero.trustSupport') }}
          </span>
        </div>
      </div>
    </UContainer>
  </section>
</template>

<style scoped>
.hero-fade-in {
  animation: heroFadeIn 0.8s ease-out both;
}
.hero-delay-1 { animation-delay: 0.1s; }
.hero-delay-2 { animation-delay: 0.2s; }
.hero-delay-3 { animation-delay: 0.35s; }
.hero-delay-4 { animation-delay: 0.5s; }

@keyframes heroFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
