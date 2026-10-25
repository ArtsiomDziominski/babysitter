<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <section class="pt-20 sm:pt-28">
    <UContainer>
      <div class="flex flex-col items-center gap-5 rounded-[2.5rem] bg-primary-600 px-6 py-16 text-center text-white sm:py-20 dark:bg-primary-700">
        <h2 class="max-w-3xl font-display text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl lg:text-5xl">
          {{ t('home.cta.title') }}
        </h2>
        <p class="text-lg text-white/90">
          {{ t('home.cta.subtitle') }}
        </p>
        <div class="mt-2 flex flex-wrap justify-center gap-3">
          <UButton
            to="/search"
            :label="t('home.cta.ctaParent')"
            icon="i-lucide-search"
            size="xl"
            color="neutral"
            class="rounded-full bg-white px-7 font-extrabold text-stone-900 hover:bg-stone-100"
          />
          <UButton
            to="/register"
            :label="t('home.cta.ctaBabysitter')"
            icon="i-lucide-user-plus"
            size="xl"
            color="neutral"
            class="rounded-full bg-stone-900 px-7 font-bold text-white hover:bg-stone-800"
          />
        </div>
      </div>
    </UContainer>
  </section>
</template>
