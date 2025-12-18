<template>
  <div
      :class="[
        'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center gap-3',
        variant === 'center' ? 'justify-center' : ''
      ]">
    <UIcon name="i-heroicons-check-circle" class="text-green-600 dark:text-green-400 flex-shrink-0" size="20"/>
    <span class="text-sm font-medium text-green-700 dark:text-green-400">
      {{ t('account.nannyForm.showInSearchTitle') }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '#imports'

defineProps<{
  variant?: 'top' | 'center'
}>()

const { t } = useI18n()
</script>

