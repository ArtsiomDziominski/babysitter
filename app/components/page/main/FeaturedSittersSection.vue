<script setup lang="ts">
const { t } = useI18n()
const siteConfig = useSiteConfig()

const sitters = [
  { name: 'Анна М.', experience: 3, rating: 4.9, price: 25, tint: 'bg-amber-200 text-amber-900 dark:bg-amber-900/60 dark:text-amber-100' },
  { name: 'Мария К.', experience: 5, rating: 4.8, price: 30, tint: 'bg-sky-200 text-sky-900 dark:bg-sky-900/60 dark:text-sky-100' },
  { name: 'Елена Д.', experience: 2, rating: 5.0, price: 20, tint: 'bg-rose-200 text-rose-900 dark:bg-rose-900/60 dark:text-rose-100' },
  { name: 'Натали С.', experience: 7, rating: 4.9, price: 35, tint: 'bg-emerald-200 text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-100' },
  { name: 'Софи Р.', experience: 4, rating: 4.7, price: 22, tint: 'bg-violet-200 text-violet-900 dark:bg-violet-900/60 dark:text-violet-100' },
  { name: 'Дарья В.', experience: 6, rating: 4.8, price: 28, tint: 'bg-orange-200 text-orange-900 dark:bg-orange-900/60 dark:text-orange-100' }
]

const initials = (name: string) => name.split(' ').map(part => part[0]).join('')
</script>

<template>
  <section class="pt-20 sm:pt-28">
    <UContainer>
      <div class="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 class="font-display text-3xl font-semibold tracking-tight text-highlighted sm:text-4xl lg:text-5xl">
            {{ t('home.featured.title') }}
          </h2>
          <p class="mt-3 text-lg text-muted">
            {{ t('home.featured.subtitle') }}
          </p>
        </div>
        <UButton
          to="/search"
          :label="t('home.featured.viewAll')"
          trailing-icon="i-lucide-arrow-right"
          color="neutral"
          variant="ghost"
          size="lg"
          class="rounded-full bg-default px-5 font-bold"
        />
      </div>
    </UContainer>

    <UContainer class="max-sm:px-0">
      <ul class="scrollbar-hide flex snap-x gap-4 overflow-x-auto pb-2 max-sm:px-4">
        <li v-for="sitter in sitters" :key="sitter.name" class="w-64 shrink-0 snap-start sm:w-72">
          <NuxtLink to="/search" class="group flex h-full flex-col gap-4 rounded-[2rem] bg-default p-3">
            <div class="flex h-56 items-end justify-between rounded-3xl p-4 sm:h-64" :class="sitter.tint">
              <span class="font-display text-4xl font-semibold" aria-hidden="true">{{ initials(sitter.name) }}</span>
              <span class="flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-sm font-bold text-stone-900">
                <UIcon name="i-mdi-star" class="size-4 text-amber-500" />
                {{ sitter.rating.toFixed(1) }}
              </span>
            </div>
            <div class="flex flex-col gap-1 px-2 pb-2">
              <h3 class="text-lg font-extrabold text-highlighted">{{ sitter.name }}</h3>
              <p class="text-sm text-muted">{{ sitter.experience }} {{ t('home.featured.experience') }}</p>
              <div class="mt-2 flex items-center justify-between">
                <p class="text-lg font-extrabold text-highlighted">
                  {{ sitter.price }} {{ siteConfig.currency }}
                  <span class="text-sm font-medium text-muted">{{ t('home.featured.perHour') }}</span>
                </p>
                <span class="flex size-11 items-center justify-center rounded-full bg-inverted transition-transform group-hover:rotate-45" aria-hidden="true">
                  <UIcon name="i-lucide-arrow-up-right" class="size-5 text-inverted" />
                </span>
              </div>
            </div>
          </NuxtLink>
        </li>
      </ul>
    </UContainer>
  </section>
</template>
