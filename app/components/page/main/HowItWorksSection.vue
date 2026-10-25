<script setup lang="ts">
const { t } = useI18n()

const steps = [
  { key: 'step1', icon: 'i-lucide-search' },
  { key: 'step2', icon: 'i-lucide-id-card' },
  { key: 'step3', icon: 'i-lucide-handshake' }
]
</script>

<template>
  <UPageSection
    :title="t('home.howItWorks.title')"
    :description="t('home.howItWorks.subtitle')"
  >
    <ol class="grid gap-8 md:grid-cols-3">
      <li v-for="(step, index) in steps" :key="step.key" class="relative flex flex-col items-center text-center">
        <div class="relative mb-5">
          <div class="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
            <UIcon :name="step.icon" class="size-8" />
          </div>
          <span class="absolute -top-2 -right-2 flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-inverted">
            {{ index + 1 }}
          </span>
        </div>
        <h3 class="text-lg font-semibold text-highlighted">
          {{ t(`home.howItWorks.${step.key}.title`) }}
        </h3>
        <p class="mt-2 max-w-xs text-muted">
          {{ t(`home.howItWorks.${step.key}.description`) }}
        </p>
      </li>
    </ol>
  </UPageSection>
</template>
