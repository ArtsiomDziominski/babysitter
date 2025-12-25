<template>
  <div class="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
    <UChatPrompt
      :model-value="input"
      :disabled="disabled"
      :placeholder="$t('account.messages.inputPlaceholder')"
      @update:model-value="$emit('update:input', $event)"
      @submit="$emit('submit')"
    >
      <UChatPromptSubmit
        :status="status"
        @stop="$emit('stop')"
        @reload="$emit('reload')"
      />
    </UChatPrompt>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  input: string
  disabled: boolean
  status: 'submitted' | 'streaming' | 'ready' | 'error'
}>()

defineEmits<{
  'update:input': [value: string]
  submit: []
  stop: []
  reload: []
}>()
</script>

