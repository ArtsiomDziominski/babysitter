<script setup lang="ts">
const advantages = [
  { key: 'verified', icon: 'mdi:shield-check', color: 'from-green-200 to-emerald-200 dark:from-green-800 dark:to-emerald-800' },
  { key: 'safe', icon: 'mdi:lock', color: 'from-blue-200 to-cyan-200 dark:from-blue-800 dark:to-cyan-800' },
  { key: 'flexible', icon: 'mdi:clock-outline', color: 'from-purple-200 to-pink-200 dark:from-purple-800 dark:to-pink-800' },
  { key: 'support', icon: 'mdi:headset', color: 'from-orange-200 to-red-200 dark:from-orange-800 dark:to-red-800' }
]
</script>

<template>
  <section class="py-20 bg-white dark:bg-gray-900">
    <UContainer>
      <h2 class="text-3xl lg:text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
        {{ $t('home.advantages.title') }}
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div v-for="advantage in advantages" :key="advantage.key" class="p-6 rounded-xl bg-gray-50 dark:bg-gray-800 hover:shadow-lg transition-shadow">
          <div :class="`w-16 h-16 rounded-xl bg-gradient-to-br ${advantage.color} flex items-center justify-center mb-4`">
            <Icon :name="advantage.icon" size="32" class="text-white" />
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {{ $t(`home.advantages.${advantage.key}.title`) }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            {{ $t(`home.advantages.${advantage.key}.description`) }}
          </p>
        </div>
      </div>
    </UContainer>
  </section>
</template>

