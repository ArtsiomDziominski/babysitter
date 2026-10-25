<template>
  <div
      :class="[
        'bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded-lg p-4 flex items-center gap-3',
        variant === 'center' ? 'justify-center' : ''
      ]">
    <UIcon name="i-heroicons-check-circle" class="text-success-600 dark:text-success-400 flex-shrink-0" size="20"/>
    <span class="text-sm font-medium text-success-700 dark:text-success-400">
      {{ t('account.nannyForm.showInSearchTitle') }}
    </span>
  </div>
</template>

<script setup lang="ts">

defineProps<{
  variant?: 'top' | 'center'
}>()

const { t } = useI18n()
</script>

