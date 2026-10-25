<script setup lang="ts">
const { t } = useI18n()
const siteConfig = useSiteConfig()

const sitters = [
  { name: 'Анна М.', experience: 3, rating: 4.9, reviewCount: 47, price: 25, verified: true },
  { name: 'Мария К.', experience: 5, rating: 4.8, reviewCount: 62, price: 30, verified: true },
  { name: 'Елена Д.', experience: 2, rating: 5.0, reviewCount: 28, price: 20, verified: true },
  { name: 'Натали С.', experience: 7, rating: 4.9, reviewCount: 93, price: 35, verified: true },
  { name: 'Софи Р.', experience: 4, rating: 4.7, reviewCount: 34, price: 22, verified: false },
  { name: 'Дарья В.', experience: 6, rating: 4.8, reviewCount: 71, price: 28, verified: true }
]

const links = computed(() => [
  { label: t('home.featured.viewAll'), to: '/search', trailingIcon: 'i-lucide-arrow-right', color: 'neutral' as const, variant: 'outline' as const }
])
</script>

<template>
  <UPageSection
    :title="t('home.featured.title')"
    :description="t('home.featured.subtitle')"
    :links="links"
  >
    <UPageGrid>
      <UPageCard
        v-for="sitter in sitters"
        :key="sitter.name"
        to="/search"
        spotlight
        spotlight-color="primary"
      >
        <div class="flex items-start justify-between gap-3">
          <UUser
            :name="sitter.name"
            :description="`${sitter.experience} ${t('home.featured.experience')}`"
            :avatar="{ alt: sitter.name }"
            size="xl"
          />
          <UBadge
            v-if="sitter.verified"
            :label="t('home.featured.verified')"
            icon="i-lucide-badge-check"
            color="success"
            variant="subtle"
            class="rounded-full"
          />
        </div>

        <div class="flex items-center gap-2 text-sm">
          <UIcon name="i-mdi-star" class="size-4 text-amber-400" />
          <span class="font-semibold text-highlighted">{{ sitter.rating.toFixed(1) }}</span>
          <span class="text-muted">· {{ sitter.reviewCount }} {{ t('home.featured.reviews') }}</span>
        </div>

        <USeparator />

        <p class="text-lg font-bold text-highlighted">
          {{ sitter.price }} {{ siteConfig.currency }}
          <span class="text-sm font-normal text-muted">{{ t('home.featured.perHour') }}</span>
        </p>
      </UPageCard>
    </UPageGrid>
  </UPageSection>
</template>
