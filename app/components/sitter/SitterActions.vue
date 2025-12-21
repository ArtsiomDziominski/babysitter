<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
    <div class="space-y-3">
      <UButton
        color="primary"
        size="lg"
        block
        class="font-semibold"
        @click="$emit('contact')"
      >
        <Icon name="i-lucide-phone" size="20" class="mr-2" />
        Позвать
      </UButton>
      <UButton
        variant="outline"
        size="lg"
        block
        class="font-semibold"
        @click="$emit('message')"
      >
        <Icon name="i-lucide-message-circle" size="20" class="mr-2" />
        Написать
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  contact: []
  message: []
}>()
</script>
