<template>
  <div v-if="price" class="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
    <div class="flex justify-between items-center">
      <span class="text-sm font-medium text-primary-700 dark:text-primary-300">
        {{ $t('account.booking.create.estimatedPrice') }}
      </span>
      <span class="text-xl font-bold text-primary-900 dark:text-primary-100">
        {{ price }} ₽
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  price: number | null
}>()
</script>

