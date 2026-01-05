<template>
  <span
    v-if="text"
    :class="{
      'font-bold': child.bold,
      'italic': child.italic,
      'underline': child.underline,
      'line-through': child.strikethrough,
      'font-mono bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm': child.code
    }"
  >
    {{ text }}
  </span>
</template>

<script setup lang="ts">
import type { StrapiTextChild } from '~/types/blog'

const props = defineProps<{
  child: StrapiTextChild
}>()

const text = computed(() => {
  if (!props.child) return ''
  if (typeof props.child === 'string') return props.child
  if (typeof props.child === 'object' && 'text' in props.child) {
    return props.child.text || ''
  }
  return ''
})
</script>

