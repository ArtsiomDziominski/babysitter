<template>
  <ul v-if="block.format === 'unordered'" class="list-disc list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300">
    <li v-for="(item, index) in listItems" :key="index">
      <template v-for="(child, childIndex) in item.children" :key="childIndex">
        <component :is="getChildComponent(child)" :child="child" />
      </template>
    </li>
  </ul>
  <ol v-else class="list-decimal list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300">
    <li v-for="(item, index) in listItems" :key="index">
      <template v-for="(child, childIndex) in item.children" :key="childIndex">
        <component :is="getChildComponent(child)" :child="child" />
      </template>
    </li>
  </ol>
</template>

<script setup lang="ts">
import type { StrapiBlock } from '~/types/blog'

interface Props {
  block: StrapiBlock
}

const props = defineProps<Props>()

const listItems = computed(() => {
  return props.block.children?.filter((child: any) => child.type === 'list-item') || []
})

const getChildComponent = (child: any) => {
  if (child.type === 'text') {
    return 'BlogText'
  }
  return 'span'
}
</script>

