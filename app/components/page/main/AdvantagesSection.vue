<script setup lang="ts">
const { t } = useI18n()

const features = computed(() => [
  { key: 'verified', icon: 'i-lucide-shield-check' },
  { key: 'safe', icon: 'i-lucide-lock' },
  { key: 'flexible', icon: 'i-lucide-clock' },
  { key: 'support', icon: 'i-lucide-headset' }
].map(item => ({
  icon: item.icon,
  title: t(`home.advantages.${item.key}.title`),
  description: t(`home.advantages.${item.key}.description`)
})))
</script>

<template>
  <UPageSection
    :title="t('home.advantages.title')"
    :description="t('home.advantages.subtitle')"
    :features="features"
    class="bg-muted/50"
    :ui="{ features: 'sm:grid-cols-2 lg:grid-cols-4' }"
  />
</template>
