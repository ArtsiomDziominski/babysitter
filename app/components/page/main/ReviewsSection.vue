<script setup lang="ts">
const { t } = useI18n()

const testimonials = [
  { key: '1', rating: 5, gradient: 'from-rose-400 to-pink-500' },
  { key: '2', rating: 5, gradient: 'from-violet-400 to-purple-500' },
  { key: '3', rating: 5, gradient: 'from-sky-400 to-info-500' }
]
</script>

<template>
  <section class="py-20 lg:py-28 bg-default">
    <UContainer>
      <div v-reveal class="text-center mb-16">
        <h2 class="text-3xl lg:text-4xl font-bold text-highlighted mb-4">
          {{ t('home.reviews.title') }}
        </h2>
        <p class="text-lg text-toned max-w-2xl mx-auto">
          {{ t('home.reviews.subtitle') }}
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="(item, i) in testimonials"
          :key="item.key"
          v-reveal="i * 150"
          class="relative p-6 lg:p-8 rounded-2xl bg-muted border border-default hover:shadow-lg transition-shadow duration-300"
        >
          <Icon name="mdi:format-quote-open" size="36" class="text-primary-200 dark:text-primary-800 mb-4" />

          <p class="text-default leading-relaxed mb-6">
            {{ t(`home.testimonials.${item.key}.text`) }}
          </p>

          <div class="flex gap-1 mb-4">
            <Icon
              v-for="star in item.rating"
              :key="star"
              name="mdi:star"
              size="18"
              class="text-amber-400"
            />
          </div>

          <div class="flex items-center gap-3 pt-4 border-t border-default">
            <div :class="['w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-sm font-bold', item.gradient]">
              {{ t(`home.testimonials.${item.key}.name`).charAt(0) }}
            </div>
            <div>
              <div class="font-semibold text-highlighted text-sm">
                {{ t(`home.testimonials.${item.key}.name`) }}
              </div>
              <div class="text-xs text-muted">
                {{ t(`home.testimonials.${item.key}.city`) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </UContainer>
  </section>
</template>
