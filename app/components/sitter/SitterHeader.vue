<template>
  <div>
    <SitterHero
      :sitter="sitter"
      @contact="$emit('contact')"
      @message="$emit('message')"
    />
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
