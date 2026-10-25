<script setup lang="ts">
const { t } = useI18n()

const links = computed(() => [
  { label: t('home.cta.ctaBabysitter'), to: '/register', icon: 'i-lucide-user-plus', size: 'xl' as const, color: 'neutral' as const },
  { label: t('home.cta.ctaParent'), to: '/search', size: 'xl' as const, color: 'neutral' as const, variant: 'outline' as const, class: 'text-white ring-white/40 hover:bg-white/10' }
])
</script>

<template>
  <UPageSection :ui="{ container: 'py-16 sm:py-24' }">
    <UPageCTA
      :title="t('home.cta.title')"
      :description="t('home.cta.subtitle')"
      :links="links"
      variant="solid"
      class="bg-gradient-to-br from-primary-500 to-primary-700 dark:from-primary-600 dark:to-primary-900"
      :ui="{ title: 'text-white', description: 'text-white/85' }"
    >
      <template #top>
        <div class="flex justify-center pt-10 sm:pt-16">
          <UBadge :label="t('home.cta.badge')" icon="i-lucide-heart" color="neutral" variant="outline" class="rounded-full bg-white/10 text-white ring-white/30" />
        </div>
      </template>
    </UPageCTA>
  </UPageSection>
</template>
