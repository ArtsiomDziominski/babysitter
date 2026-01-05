<template>
  <blockquote class="border-l-4 border-primary-500 pl-4 py-2 my-4 italic text-gray-600 dark:text-gray-400">
    <template v-for="(child, index) in block.children" :key="index">
      <component :is="getChildComponent(child)" :child="child" />
    </template>
  </blockquote>
</template>

<script setup lang="ts">
import type { StrapiBlock } from '~/types/blog'

interface Props {
  block: StrapiBlock
}

const props = defineProps<Props>()

const getChildComponent = (child: any) => {
  if (child.type === 'text') {
    return 'BlogText'
  }
  return 'span'
}
</script>

