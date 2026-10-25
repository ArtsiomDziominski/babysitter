<script setup lang="ts">
const { t } = useI18n()

const city = ref('')

const avatars = [
  { text: 'АК', class: 'bg-amber-200 text-amber-900' },
  { text: 'МЛ', class: 'bg-sky-200 text-sky-900' },
  { text: 'ЕД', class: 'bg-rose-200 text-rose-900' }
]

const search = () => {
  const value = city.value.trim()
  navigateTo({ path: '/search', query: value ? { city: value } : undefined })
}
</script>

<template>
  <UContainer class="pt-6 sm:pt-8">
    <div class="grid gap-4 lg:grid-cols-3">
      <div class="relative isolate flex flex-col justify-end gap-6 overflow-hidden rounded-[2.25rem] bg-primary-600 p-6 text-white sm:min-h-[26rem] sm:p-12 lg:col-span-2 dark:bg-primary-700">
        <div class="absolute -top-16 -right-16 -z-10 size-72 rounded-full bg-white/10" aria-hidden="true" />
        <div class="absolute top-16 right-32 -z-10 size-24 rounded-full bg-white/15" aria-hidden="true" />

        <h1 class="max-w-2xl font-display text-[1.75rem] font-semibold leading-[1.08] tracking-tight text-balance min-[400px]:text-4xl sm:text-5xl lg:text-6xl">
          {{ t('home.hero.title') }}
        </h1>
        <p class="max-w-lg text-lg text-white/90 text-balance">
          {{ t('home.hero.subtitle') }}
        </p>

        <form class="flex max-w-xl flex-wrap gap-2 rounded-[1.75rem] bg-white p-1.5 sm:rounded-full" @submit.prevent="search">
          <UInput
            v-model="city"
            :placeholder="t('home.hero.searchPlaceholder')"
            :aria-label="t('home.hero.searchPlaceholder')"
            icon="i-lucide-map-pin"
            variant="none"
            size="xl"
            class="min-w-48 flex-1"
            :ui="{ base: 'text-stone-900 placeholder:text-stone-500', leadingIcon: 'text-stone-500' }"
          />
          <UButton
            type="submit"
            :label="t('home.hero.cta')"
            icon="i-lucide-search"
            size="xl"
            color="neutral"
            class="w-full justify-center rounded-full bg-stone-900 px-6 text-white hover:bg-stone-800 sm:w-auto"
          />
        </form>
      </div>

      <div class="flex flex-col gap-4">
        <div class="flex flex-1 flex-col justify-between gap-6 rounded-[2.25rem] bg-default p-8">
          <div class="flex -space-x-3" aria-hidden="true">
            <span
              v-for="avatar in avatars"
              :key="avatar.text"
              class="flex size-12 items-center justify-center rounded-full text-xs font-bold ring-4 ring-(--ui-bg)"
              :class="avatar.class"
            >
              {{ avatar.text }}
            </span>
            <span class="flex size-12 items-center justify-center rounded-full bg-inverted text-xs font-bold text-inverted ring-4 ring-(--ui-bg)">2k+</span>
          </div>
          <div>
            <p class="font-display text-5xl font-semibold text-highlighted">
              4.9<span class="text-2xl text-muted">/5</span>
            </p>
            <p class="mt-2 text-muted">
              {{ t('home.stats.rating') }} · {{ t('home.hero.trusted') }}
            </p>
          </div>
        </div>

        <NuxtLink
          to="/register"
          class="group flex items-center justify-between gap-4 rounded-[2.25rem] bg-stone-900 px-8 py-7 text-white dark:bg-stone-800"
        >
          <span>
            <span class="block text-sm text-stone-300">{{ t('home.hero.babysitterPrompt') }}</span>
            <span class="mt-1 block font-display text-xl font-semibold">{{ t('home.cta.ctaBabysitter') }}</span>
          </span>
          <span class="flex size-13 shrink-0 items-center justify-center rounded-full bg-primary-600 transition-transform group-hover:rotate-45" aria-hidden="true">
            <UIcon name="i-lucide-arrow-up-right" class="size-6 text-white" />
          </span>
        </NuxtLink>
      </div>
    </div>
  </UContainer>
</template>
