<template>
  <div class="grid grid-cols-1 lg:grid-cols-[430px_1fr] gap-6">
    <div class="space-y-4">
      <SitterPhoto
        :sitter="sitter"
      />

      <SitterQuickInfo :sitter="sitter" />

      <SitterActions
        @contact="$emit('contact')"
        @message="$emit('message')"
      />
    </div>

    <div class="space-y-4 lg:space-y-6">
      <SitterPriceCard :sitter="sitter" />

      <SitterStatsCard :sitter="sitter" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Sitter } from '~/types/sitter'

defineProps<{
  sitter: Sitter
}>()

defineEmits<{
  contact: []
  message: []
}>()
</script>

