<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
    <div class="lg:col-span-2 relative">
      <SitterPhoto
        :sitter="sitter"
        :is-favorite="isFavorite"
        @toggle-favorite="$emit('toggle-favorite')"
      />
    </div>
    <SitterStats :sitter="sitter" />
  </div>
</template>

<script setup lang="ts">
import type { Sitter } from '~/types/sitter'

defineProps<{
  sitter: Sitter
  isFavorite: boolean
}>()

defineEmits<{
  'toggle-favorite': []
}>()
</script>
