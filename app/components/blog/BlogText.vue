<template>
  <span
    :class="{
      'font-bold': child.bold,
      'italic': child.italic,
      'underline': child.underline,
      'line-through': child.strikethrough,
      'font-mono bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm': child.code
    }"
  >
    {{ child.text }}
  </span>
</template>

<script setup lang="ts">
import type { StrapiTextChild } from '~/types/blog'

defineProps<{
  child: StrapiTextChild
}>()
</script>

