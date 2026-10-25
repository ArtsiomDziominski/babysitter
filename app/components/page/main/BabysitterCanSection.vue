<script setup lang="ts">
const { t } = useI18n()

const services = [
  { key: 'home', icon: 'i-lucide-house' },
  { key: 'transport', icon: 'i-lucide-car' },
  { key: 'school', icon: 'i-lucide-school' },
  { key: 'party', icon: 'i-lucide-party-popper' },
  { key: 'mall', icon: 'i-lucide-shopping-bag' },
  { key: 'relatives', icon: 'i-lucide-users' },
  { key: 'chores', icon: 'i-lucide-sparkles' }
]
</script>

<template>
  <UPageSection
    :headline="t('home.babysitterCan.label')"
    :title="t('home.babysitterCan.title')"
    :description="t('home.babysitterCan.subtitle')"
    class="bg-muted/50"
  >
    <UPageGrid class="grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
      <UPageCard
        v-for="service in services"
        :key="service.key"
        :icon="service.icon"
        :description="t(`home.babysitterCan.services.${service.key}`)"
        :ui="{ leadingIcon: 'text-primary', description: 'text-default font-medium' }"
      />
      <UPageCard
        :title="t('home.babysitterCan.more')"
        :description="`${t('home.babysitterCan.cta')} →`"
        icon="i-lucide-ellipsis"
        to="/search"
        variant="soft"
        :ui="{ root: 'border border-dashed border-primary/40 bg-primary/5', leadingIcon: 'text-primary', title: 'text-primary', description: 'text-primary underline underline-offset-4' }"
      />
    </UPageGrid>
  </UPageSection>
</template>
