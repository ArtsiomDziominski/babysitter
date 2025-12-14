<template>
  <div class="space-y-4">
    <SitterCard
      v-for="sitter in sitters"
      :key="sitter.id"
      :sitter="sitter"
      @book="$emit('book', $event)"
    />

    <div
      v-if="sitters.length === 0"
      class="text-center py-12"
    >
      <p class="text-gray-500 dark:text-gray-400">
        {{ $t('bookings.empty') }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Sitter } from '~/types/sitter'
import SitterCard from './SitterCard.vue'

defineProps<{
  sitters: Sitter[]
}>()

defineEmits<{
  book: [sitterId: string]
}>()
</script>
