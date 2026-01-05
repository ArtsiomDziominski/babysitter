<template>
  <div class="space-y-4">
    <SitterCardDetailed
      v-for="sitter in sitters"
      :key="sitter.id"
      :sitter="sitter"
      @book="$emit('book', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import type { BabysitterListItem } from '~/composables/useBabysitter'
import SitterCardDetailed from './SitterCardDetailed.vue'

defineProps<{
  sitters: BabysitterListItem[]
}>()

defineEmits<{
  book: [sitterId: string | number]
}>()
</script>
