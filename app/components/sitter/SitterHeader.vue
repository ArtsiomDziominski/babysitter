<template>
  <div>
    <SitterHero
      :sitter="sitter"
      :is-favorite="isFavorite"
      @toggle-favorite="$emit('toggle-favorite')"
      @contact="$emit('contact')"
      @message="$emit('message')"
    />
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
  contact: []
  message: []
}>()
</script>
