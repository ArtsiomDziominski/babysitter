<template>
  <div class="blog-content">
    <template v-for="(block, index) in processedBlocks" :key="index">
      <BlogHeading
        v-if="shouldRenderBlock(index, 'heading')"
        :block="block"
      />
      <BlogParagraph
        v-else-if="shouldRenderBlock(index, 'paragraph')"
        :block="block"
      />
      <BlogList
        v-else-if="shouldRenderBlock(index, 'list')"
        :blocks="processedBlocks"
        :start-index="index"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { StrapiBlock } from '~/types/blog'

const props = defineProps<{
  content: StrapiBlock[]
}>()

const processedBlocks = computed(() => props.content)

const skippedIndices = computed(() => {
  const skipped = new Set<number>()
  
  for (let i = 0; i < processedBlocks.value.length; i++) {
    const block = processedBlocks.value[i]
    
    if (block.type === 'list' && i > 0) {
      const prevBlock = processedBlocks.value[i - 1]
      if (prevBlock?.type === 'list' && prevBlock.format === block.format) {
        skipped.add(i)
      }
    }
  }
  
  return skipped
})

function shouldRenderBlock(index: number, type: 'heading' | 'paragraph' | 'list'): boolean {
  if (skippedIndices.value.has(index)) {
    return false
  }
  
  const block = processedBlocks.value[index]
  if (block?.type !== type) return false
  
  if (type === 'heading') {
    return hasHeadingContent(block)
  }
  
  if (type === 'paragraph') {
    return hasParagraphContent(block)
  }
  
  if (type === 'list') {
    if (index === 0) return true
    const prevBlock = processedBlocks.value[index - 1]
    return prevBlock?.type !== 'list' || prevBlock.format !== block.format
  }
  
  return false
}

function hasHeadingContent(block: StrapiBlock): boolean {
  return block.children.some(
    child => child.type === 'text' && child.text.trim()
  )
}

function hasParagraphContent(block: StrapiBlock): boolean {
  return block.children.some(
    child => child.type === 'text' && child.text.trim()
  )
}
</script>

<style scoped>
.blog-content :deep(h1),
.blog-content :deep(h2),
.blog-content :deep(h3),
.blog-content :deep(h4),
.blog-content :deep(h5),
.blog-content :deep(h6) {
  @apply font-semibold text-gray-900 dark:text-white mt-6 mb-4 first:mt-0;
}

.blog-content :deep(p) {
  @apply text-gray-700 dark:text-gray-300 mb-4 leading-relaxed;
}

.blog-content :deep(ul),
.blog-content :deep(ol) {
  @apply mb-4 ml-6 space-y-2;
}

.blog-content :deep(ul) {
  @apply list-disc;
}

.blog-content :deep(ol) {
  @apply list-decimal;
}

.blog-content :deep(li) {
  @apply text-gray-700 dark:text-gray-300;
}
</style>

