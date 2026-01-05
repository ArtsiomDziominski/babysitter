<template>
  <p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
    <BlogText
      v-for="(child, index) in textChildren"
      :key="index"
      :child="child"
    />
  </p>
</template>

<script setup lang="ts">
import type { StrapiBlock } from '~/types/blog'

const props = defineProps<{
  block: StrapiBlock
}>()

const textChildren = computed(() => {
  return props.block.children.filter(
    (child): child is import('~/types/blog').StrapiTextChild => child.type === 'text'
  )
})
</script>

