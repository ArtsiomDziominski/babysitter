<script setup lang="ts">
const { t } = useI18n()

const testimonials = ['1', '2', '3', '4', '5', '6']
</script>

<template>
  <UPageSection
    :headline="t('home.reviews.label')"
    :title="t('home.reviews.title')"
    :description="t('home.reviews.subtitle')"
  >
    <UPageColumns>
      <UPageCard
        v-for="key in testimonials"
        :key="key"
        variant="subtle"
        :description="t(`home.testimonials.${key}.text`)"
        :ui="{ description: 'text-default before:content-[open-quote] after:content-[close-quote]' }"
      >
        <template #header>
          <div class="flex gap-0.5">
            <UIcon v-for="star in 5" :key="star" name="i-mdi-star" class="size-4 text-amber-400" />
          </div>
        </template>
        <template #footer>
          <UUser
            :name="t(`home.testimonials.${key}.name`)"
            :description="t(`home.testimonials.${key}.city`)"
            :avatar="{ alt: t(`home.testimonials.${key}.name`) }"
          />
        </template>
      </UPageCard>
    </UPageColumns>
  </UPageSection>
</template>
