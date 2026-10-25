<script setup lang="ts">
const { t } = useI18n()

const featured = '4'
const others = ['3', '7']
</script>

<template>
  <section class="pt-20 sm:pt-28">
    <UContainer>
      <div class="mb-10">
        <h2 class="font-display text-3xl font-semibold tracking-tight text-highlighted sm:text-4xl lg:text-5xl">
          {{ t('home.reviews.title') }}
        </h2>
        <p class="mt-3 text-lg text-muted">
          {{ t('home.reviews.subtitle') }}
        </p>
      </div>

      <div class="grid gap-4 lg:grid-cols-3">
        <figure class="flex flex-col justify-between gap-8 rounded-[2.25rem] bg-primary-100 p-8 sm:p-12 lg:col-span-2 dark:bg-primary-950">
          <blockquote class="font-display text-2xl font-medium leading-snug text-highlighted sm:text-3xl">
            «{{ t(`home.testimonials.${featured}.text`) }}»
          </blockquote>
          <figcaption>
            <UUser
              :name="t(`home.testimonials.${featured}.name`)"
              :description="t(`home.testimonials.${featured}.city`)"
              :avatar="{ alt: t(`home.testimonials.${featured}.name`), class: 'bg-default' }"
              size="lg"
            />
          </figcaption>
        </figure>

        <div class="flex flex-col gap-4">
          <figure
            v-for="key in others"
            :key="key"
            class="flex flex-1 flex-col gap-4 rounded-[1.75rem] bg-default p-7"
          >
            <blockquote class="text-default">
              «{{ t(`home.testimonials.${key}.text`) }}»
            </blockquote>
            <figcaption class="mt-auto text-sm">
              <span class="font-bold text-highlighted">{{ t(`home.testimonials.${key}.name`) }}</span>
              <span class="text-muted"> · {{ t(`home.testimonials.${key}.city`) }}</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </UContainer>
  </section>
</template>
