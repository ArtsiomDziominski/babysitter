<template>
  <component
    v-if="hasContent"
    :is="`h${block.level || 2}`"
    :class="headingClasses"
  >
    <template v-for="(child, index) in block.children" :key="index">
      <BlogText v-if="child.type === 'text'" :child="child" />
      <span v-else>{{ child.text || '' }}</span>
    </template>
  </component>
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

const headingClasses = computed(() => {
  const base = 'font-bold text-gray-900 dark:text-white mb-4 mt-6'
  const level = props.block.level || 2
  
  switch (level) {
    case 1:
      return `${base} text-3xl md:text-4xl`
    case 2:
      return `${base} text-2xl md:text-3xl`
    case 3:
      return `${base} text-xl md:text-2xl`
    case 4:
      return `${base} text-lg md:text-xl`
    default:
      return `${base} text-base md:text-lg`
  }
})

const getChildComponent = (child: any) => {
  if (child.type === 'text') {
    return 'BlogText'
  }
  return 'span'
}
</script>

