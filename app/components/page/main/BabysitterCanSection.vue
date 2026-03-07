<script setup lang="ts">
const { t } = useI18n()

const services = [
  { key: 'home', icon: 'mdi:home-heart', color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20', border: 'border-rose-100 dark:border-rose-900/30' },
  { key: 'transport', icon: 'mdi:car-child-seat', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-100 dark:border-blue-900/30' },
  { key: 'school', icon: 'mdi:school-outline', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-100 dark:border-emerald-900/30' },
  { key: 'party', icon: 'mdi:party-popper', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-100 dark:border-amber-900/30' },
  { key: 'mall', icon: 'mdi:shopping-outline', color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-900/20', border: 'border-violet-100 dark:border-violet-900/30' },
  { key: 'relatives', icon: 'mdi:account-group-outline', color: 'text-pink-500', bg: 'bg-pink-50 dark:bg-pink-900/20', border: 'border-pink-100 dark:border-pink-900/30' },
  { key: 'chores', icon: 'mdi:broom', color: 'text-teal-500', bg: 'bg-teal-50 dark:bg-teal-900/20', border: 'border-teal-100 dark:border-teal-900/30' },
]
</script>

<template>
  <section class="py-20 lg:py-28 bg-white dark:bg-gray-900">
    <UContainer>
      <div v-reveal class="text-center mb-14">
        <p class="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-3">
          {{ t('home.babysitterCan.label') }}
        </p>
        <h2 class="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white mb-4">
          {{ t('home.babysitterCan.title') }}
        </h2>
        <p class="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          {{ t('home.babysitterCan.subtitle') }}
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="(service, i) in services"
          :key="service.key"
          v-reveal="i * 70"
          :class="[
            'group relative p-5 rounded-2xl border transition-all duration-300 cursor-default',
            'hover:-translate-y-1 hover:shadow-lg',
            service.bg, service.border,
            i === 3 ? 'sm:col-span-2 lg:col-span-1' : ''
          ]"
        >
          <div :class="['w-11 h-11 rounded-xl flex items-center justify-center mb-4 bg-white dark:bg-gray-800 shadow-sm group-hover:scale-110 transition-transform duration-300', service.color]">
            <Icon :name="service.icon" size="22" />
          </div>
          <p class="text-gray-800 dark:text-gray-200 font-medium leading-snug text-sm">
            {{ t(`home.babysitterCan.services.${service.key}`) }}
          </p>
        </div>

        <div
          v-reveal="services.length * 70"
          class="group relative p-5 rounded-2xl border border-dashed border-primary-200 dark:border-primary-800 bg-primary-50/50 dark:bg-primary-900/10 transition-all duration-300 hover:-translate-y-1 flex flex-col items-start justify-center gap-3"
        >
          <div class="w-11 h-11 rounded-xl bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center text-primary-500">
            <Icon name="mdi:dots-horizontal" size="22" />
          </div>
          <p class="text-primary-600 dark:text-primary-400 font-semibold text-sm leading-snug">
            {{ t('home.babysitterCan.more') }}
          </p>
          <NuxtLink to="/search" class="text-xs text-primary-500 hover:text-primary-700 font-medium underline underline-offset-4 transition-colors">
            {{ t('home.babysitterCan.cta') }} →
          </NuxtLink>
        </div>
      </div>
    </UContainer>
  </section>
</template>
