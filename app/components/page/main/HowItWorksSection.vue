<script setup lang="ts">
const { t } = useI18n()

const steps = ['step1', 'step2', 'step3']
</script>

<template>
  <section class="pt-20 sm:pt-28">
    <UContainer>
      <div class="mb-10 text-center">
        <h2 class="font-display text-3xl font-semibold tracking-tight text-highlighted sm:text-4xl lg:text-5xl">
          {{ t('home.howItWorks.title') }}
        </h2>
        <p class="mt-3 text-lg text-muted">
          {{ t('home.howItWorks.subtitle') }}
        </p>
      </div>

      <ol class="grid gap-8 md:grid-cols-3">
        <li
          v-for="(step, index) in steps"
          :key="step"
          class="flex flex-col gap-3 border-t-2 border-dashed border-accented pt-7"
        >
          <span class="font-display text-5xl font-semibold leading-none text-primary" aria-hidden="true">
            {{ String(index + 1).padStart(2, '0') }}
          </span>
          <h3 class="mt-2 text-xl font-extrabold text-highlighted">
            {{ t(`home.howItWorks.${step}.title`) }}
          </h3>
          <p class="text-muted">
            {{ t(`home.howItWorks.${step}.description`) }}
          </p>
        </li>
      </ol>
    </UContainer>
  </section>
</template>
