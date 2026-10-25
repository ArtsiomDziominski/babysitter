<script setup lang="ts">
const { t } = useI18n()

const links = computed(() => [
  { label: t('home.hero.cta'), to: '/search', icon: 'i-lucide-search', size: 'xl' as const },
  { label: t('home.hero.ctaSecondary'), to: '/register', icon: 'i-lucide-user-plus', size: 'xl' as const, color: 'neutral' as const, variant: 'outline' as const }
])

const trustItems = [
  { key: 'trustVerified', icon: 'i-lucide-badge-check' },
  { key: 'trustFree', icon: 'i-lucide-wallet' },
  { key: 'trustSupport', icon: 'i-lucide-headset' }
]
</script>

<template>
  <div class="relative isolate overflow-hidden">
    <div class="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_0%,var(--ui-color-primary-100),transparent)] dark:bg-[radial-gradient(60%_60%_at_50%_0%,color-mix(in_oklab,var(--ui-color-primary-900)_45%,transparent),transparent)]" />

    <UPageHero
      :title="t('home.hero.title')"
      :description="t('home.hero.subtitle')"
      :links="links"
      :ui="{ title: 'text-balance', description: 'text-balance', container: 'py-20 sm:py-28 lg:py-32' }"
    >
      <template #headline>
        <UBadge
          :label="t('home.hero.trusted')"
          icon="i-lucide-shield-check"
          variant="subtle"
          size="lg"
          class="rounded-full px-3"
        />
      </template>

      <ul class="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-muted">
        <li v-for="item in trustItems" :key="item.key" class="flex items-center gap-1.5">
          <UIcon :name="item.icon" class="size-5 text-primary" />
          {{ t(`home.hero.${item.key}`) }}
        </li>
      </ul>
    </UPageHero>
  </div>
</template>
