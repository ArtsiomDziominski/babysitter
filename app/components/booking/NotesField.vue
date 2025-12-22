<template>
  <div class="w-full">
    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      {{ $t('account.booking.create.notes') }}
    </label>
    <UTextarea
      :model-value="modelValue"
      :placeholder="$t('account.booking.create.notesPlaceholder')"
      :rows="4"
      size="lg"
      class="w-full"
      @update:model-value="$emit('update:modelValue', $event)"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

