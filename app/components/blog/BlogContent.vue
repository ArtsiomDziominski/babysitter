<template>
  <div class="blog-content">
    <div v-if="typeof content === 'string'" v-html="content"></div>
    <template v-else-if="Array.isArray(content) && content.length > 0">
      <template v-for="(block, index) in processedBlocks" :key="index">
        <BlogHeading
          v-if="block && block.type === 'heading' && shouldRenderBlock(index, 'heading')"
          :block="block"
        />
        <BlogParagraph
          v-else-if="block && block.type === 'paragraph' && shouldRenderBlock(index, 'paragraph')"
          :block="block"
        />
        <BlogList
          v-else-if="block && block.type === 'list' && shouldRenderBlock(index, 'list')"
          :blocks="processedBlocks"
          :start-index="index"
        />
      </template>
    </template>
    <div v-else class="text-gray-500 dark:text-gray-400">
      Контент не найден (тип: {{ typeof content }}, массив: {{ Array.isArray(content) }})
    </div>
  </div>
</template>

<script setup lang="ts">
import type { StrapiBlock } from '~/types/blog'

const props = defineProps<{
  content: string | StrapiBlock[]
}>()

const processedBlocks = computed(() => {
  if (typeof props.content === 'string') return []
  if (!Array.isArray(props.content)) {
    console.warn('BlogContent: content is not an array', props.content)
    return []
  }
  console.log('BlogContent: processedBlocks', props.content.length, props.content)
  return props.content
})

const skippedIndices = computed(() => {
  const skipped = new Set<number>()
  
  for (let i = 0; i < processedBlocks.value.length; i++) {
    const block = processedBlocks.value[i]
    if (!block) continue
    
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
  if (!block) {
    console.warn(`BlogContent: block at index ${index} is undefined`)
    return false
  }
  
  if (block.type !== type) return false
  
  if (type === 'heading') {
    const hasContent = hasHeadingContent(block)
    if (!hasContent) {
      console.log(`BlogContent: heading at index ${index} has no content`, block)
    }
    return hasContent
  }
  
  if (type === 'paragraph') {
    const hasContent = hasParagraphContent(block)
    if (!hasContent) {
      console.log(`BlogContent: paragraph at index ${index} has no content`, block)
    }
    return hasContent
  }
  
  if (type === 'list') {
    if (index === 0) return true
    const prevBlock = processedBlocks.value[index - 1]
    return !prevBlock || prevBlock.type !== 'list' || prevBlock.format !== block.format
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
  font-weight: 600;
  color: rgb(17 24 39);
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

.blog-content :deep(h1:first-child),
.blog-content :deep(h2:first-child),
.blog-content :deep(h3:first-child),
.blog-content :deep(h4:first-child),
.blog-content :deep(h5:first-child),
.blog-content :deep(h6:first-child) {
  margin-top: 0;
}

.dark .blog-content :deep(h1),
.dark .blog-content :deep(h2),
.dark .blog-content :deep(h3),
.dark .blog-content :deep(h4),
.dark .blog-content :deep(h5),
.dark .blog-content :deep(h6) {
  color: rgb(255 255 255);
}

.blog-content :deep(p) {
  color: rgb(55 65 81);
  margin-bottom: 1rem;
  line-height: 1.75;
}

.dark .blog-content :deep(p) {
  color: rgb(209 213 219);
}

.blog-content :deep(ul),
.blog-content :deep(ol) {
  margin-bottom: 1rem;
  margin-left: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.blog-content :deep(ul) {
  list-style-type: disc;
}

.blog-content :deep(ol) {
  list-style-type: decimal;
}

.blog-content :deep(li) {
  color: rgb(55 65 81);
}

.dark .blog-content :deep(li) {
  color: rgb(209 213 219);
}
</style>

