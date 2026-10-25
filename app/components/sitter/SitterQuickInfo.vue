<template>
  <div class="bg-default rounded-2xl shadow-sm border border-default p-4">
    <div class="flex flex-wrap items-center gap-3 text-sm text-toned">
      <div v-if="sitter.registeredAt" class="flex items-center gap-1.5">
        <Icon name="i-lucide-clock" size="16" />
        <span>На сайте с {{ formatDate(sitter.registeredAt) }}</span>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import type { Sitter } from '~/types/sitter'
import { useSitterUtils } from '~/composables/useSitterUtils'

defineProps<{
  sitter: Sitter
}>()

const { formatDate } = useSitterUtils()
</script>

