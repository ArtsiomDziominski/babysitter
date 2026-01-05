<template>
  <p v-if="hasContent" class="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
    <template v-for="(child, index) in block.children" :key="index">
      <BlogText v-if="child.type === 'text'" :child="child" />
      <span v-else>{{ child.text || '' }}</span>
    </template>
  </p>
</template>

<script setup lang="ts">
import type { StrapiBlock } from '~/types/blog'

interface Props {
  block: StrapiBlock
}

const props = defineProps<Props>()

const hasContent = computed(() => {
  return props.block.children && props.block.children.some((child: any) => child?.text && child.text.trim())
})

const getChildComponent = (child: any) => {
  if (child.type === 'text') {
    return 'BlogText'
  }
  return 'span'
}
</script>

