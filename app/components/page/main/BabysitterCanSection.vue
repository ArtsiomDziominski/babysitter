<script setup lang="ts">
const { t } = useI18n()

const services = [
  { key: 'transport', icon: 'i-lucide-car' },
  { key: 'school', icon: 'i-lucide-school' },
  { key: 'party', icon: 'i-lucide-party-popper' },
  { key: 'mall', icon: 'i-lucide-shopping-bag' },
  { key: 'relatives', icon: 'i-lucide-users' },
  { key: 'chores', icon: 'i-lucide-sparkles' }
]
</script>

<template>
  <section class="pt-20 sm:pt-28">
    <UContainer>
      <div class="mb-10 text-center">
        <h2 class="font-display text-3xl font-semibold tracking-tight text-highlighted sm:text-4xl lg:text-5xl">
          {{ t('home.babysitterCan.title') }}
        </h2>
        <p class="mt-3 text-lg text-muted">
          {{ t('home.babysitterCan.subtitle') }}
        </p>
      </div>

      <ul class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <li class="flex min-h-64 flex-col justify-between gap-6 rounded-[2rem] bg-primary-100 p-8 sm:col-span-2 lg:row-span-2 dark:bg-primary-950">
          <span class="flex size-16 items-center justify-center rounded-2xl bg-default">
            <UIcon name="i-lucide-house" class="size-8 text-primary" />
          </span>
          <p class="max-w-md font-display text-2xl font-semibold leading-snug text-highlighted sm:text-3xl">
            {{ t('home.babysitterCan.services.home') }}
          </p>
        </li>

        <li
          v-for="service in services"
          :key="service.key"
          class="flex flex-col gap-4 rounded-[2rem] bg-default p-7"
        >
          <span class="flex size-13 items-center justify-center rounded-2xl bg-(--home-bg)">
            <UIcon :name="service.icon" class="size-6 text-highlighted" />
          </span>
          <p class="text-lg font-bold leading-snug text-highlighted">
            {{ t(`home.babysitterCan.services.${service.key}`) }}
          </p>
        </li>

        <li class="sm:col-span-2">
          <NuxtLink
            to="/search"
            class="flex h-full flex-col justify-between gap-4 rounded-[2rem] bg-stone-900 p-7 text-white sm:flex-row sm:items-end dark:bg-stone-800"
          >
            <span class="font-display text-xl font-semibold">{{ t('home.babysitterCan.more') }}</span>
            <span class="font-bold text-primary-300">{{ t('home.babysitterCan.cta') }} →</span>
          </NuxtLink>
        </li>
      </ul>
    </UContainer>
  </section>
</template>
