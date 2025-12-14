<template>
  <div class="space-y-4">
    <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
      {{ $t('account.booking.contractData.title') }}
    </h2>
    <p class="text-gray-600 dark:text-gray-400">
      {{ $t('account.booking.contractData.description') }}
    </p>
    <div class="space-y-2">
      <a
        v-for="(template, index) in templates"
        :key="index"
        href="#"
        class="block text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 underline"
        @click.prevent
      >
        {{ template }}
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

const templates = computed(() => [
  t('account.booking.contractData.templateBoarding'),
  t('account.booking.contractData.templateDaycare'),
  t('account.booking.contractData.templateDayNanny')
])
</script>

