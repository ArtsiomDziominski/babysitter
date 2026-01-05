<template>
  <component
    :is="`h${block.level || 1}`"
    class="font-semibold text-gray-900 dark:text-white mt-6 mb-4 first:mt-0"
    :class="{
      'text-3xl': block.level === 1,
      'text-2xl': block.level === 2,
      'text-xl': block.level === 3,
      'text-lg': block.level === 4,
      'text-base': block.level === 5 || block.level === 6
    }"
  >
    <BlogText
      v-for="(child, index) in textChildren"
      :key="index"
      :child="child"
    />
  </component>
</template>

<script setup lang="ts">
import type { StrapiBlock } from '~/types/blog'

const props = defineProps<{
  block: StrapiBlock
}>()

const textChildren = computed(() => {
  return props.block.children
    .filter((child): child is import('~/types/blog').StrapiTextChild => 
      child.type === 'text' && 'text' in child && typeof (child as any).text === 'string'
    )
    .filter(child => child.text && child.text.trim())
})
</script>

