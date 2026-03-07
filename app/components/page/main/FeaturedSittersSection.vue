<script setup lang="ts">
const { t } = useI18n()
const siteConfig = useSiteConfig()

const sitters = [
  { name: 'Анна М.', experience: 3, rating: 4.9, reviewCount: 47, price: 25, verified: true, gradient: 'from-rose-400 to-pink-500' },
  { name: 'Мария К.', experience: 5, rating: 4.8, reviewCount: 62, price: 30, verified: true, gradient: 'from-violet-400 to-purple-500' },
  { name: 'Елена Д.', experience: 2, rating: 5.0, reviewCount: 28, price: 20, verified: true, gradient: 'from-sky-400 to-blue-500' },
  { name: 'Натали С.', experience: 7, rating: 4.9, reviewCount: 93, price: 35, verified: true, gradient: 'from-amber-400 to-orange-500' },
  { name: 'Софи Р.', experience: 4, rating: 4.7, reviewCount: 34, price: 22, verified: false, gradient: 'from-emerald-400 to-teal-500' },
  { name: 'Дарья В.', experience: 6, rating: 4.8, reviewCount: 71, price: 28, verified: true, gradient: 'from-fuchsia-400 to-pink-500' }
]

const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('')
</script>

<template>
  <section class="py-20 lg:py-28 bg-white dark:bg-gray-900">
    <UContainer>
      <div v-reveal class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
        <div>
          <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {{ t('home.featured.title') }}
          </h2>
          <p class="text-lg text-gray-600 dark:text-gray-400">
            {{ t('home.featured.subtitle') }}
          </p>
        </div>
        <UButton to="/search" variant="outline" color="primary" size="lg" class="shrink-0">
          {{ t('home.featured.viewAll') }}
          <Icon name="mdi:arrow-right" size="18" />
        </UButton>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(sitter, i) in sitters"
          :key="sitter.name"
          v-reveal="i * 100"
          class="group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
        >
          <div v-if="sitter.verified" class="absolute top-4 right-4">
            <div class="flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-xs font-medium">
              <Icon name="mdi:check-decagram" size="14" />
              {{ t('home.featured.verified') }}
            </div>
          </div>

          <div class="flex items-center gap-4 mb-4">
            <div :class="['w-16 h-16 rounded-xl bg-gradient-to-br flex items-center justify-center text-white text-xl font-bold shadow-md group-hover:scale-105 transition-transform duration-300', sitter.gradient]">
              {{ getInitials(sitter.name) }}
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {{ sitter.name }}
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ sitter.experience }} {{ t('home.featured.experience') }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-3 mb-4">
            <div class="flex items-center gap-1">
              <Icon name="mdi:star" size="18" class="text-amber-400" />
              <span class="font-semibold text-gray-900 dark:text-white">{{ sitter.rating }}</span>
            </div>
            <span class="text-sm text-gray-400">·</span>
            <span class="text-sm text-gray-500 dark:text-gray-400">
              {{ sitter.reviewCount }} {{ t('home.featured.reviews') }}
            </span>
          </div>

          <div class="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
            <div class="text-lg font-bold text-gray-900 dark:text-white">
              {{ sitter.price }} {{ siteConfig.currency }}
              <span class="text-sm font-normal text-gray-500 dark:text-gray-400">{{ t('home.featured.perHour') }}</span>
            </div>
            <UButton size="sm" variant="soft" color="primary" class="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {{ t('home.featured.contact') }}
            </UButton>
          </div>
        </div>
      </div>
    </UContainer>
  </section>
</template>
