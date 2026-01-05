<template>
  <component
    :is="format === 'ordered' ? 'ol' : 'ul'"
    class="mb-4 ml-6 space-y-2"
    :class="{
      'list-decimal': format === 'ordered',
      'list-disc': format === 'unordered'
    }"
  >
    <li
      v-for="(item, index) in items"
      :key="index"
      class="text-gray-700 dark:text-gray-300"
    >
      <template v-for="(child, childIndex) in item.children" :key="childIndex">
        <BlogText
          v-if="child.type === 'text'"
          :child="child"
        />
      </template>
    </li>
  </component>
</template>

<script setup lang="ts">
import type { StrapiBlock } from '~/types/blog'

const props = defineProps<{
  blocks: StrapiBlock[]
  startIndex: number
}>()

const format = computed(() => props.blocks[props.startIndex]?.format || 'unordered')

const items = computed(() => {
  const result: import('~/types/blog').StrapiListItem[] = []
  let i = props.startIndex
  
  while (i < props.blocks.length && props.blocks[i]?.type === 'list') {
    const block = props.blocks[i]
    if (block.format === format.value) {
      const listItem = block.children.find(
        (child): child is import('~/types/blog').StrapiListItem => child.type === 'list-item'
      )
      if (listItem) {
        result.push(listItem)
      }
      i++
    } else {
      break
    }
  }
  
  return result
})
</script>

