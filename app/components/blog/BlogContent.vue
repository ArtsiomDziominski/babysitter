<template>
  <div>
    <template v-for="(block, index) in blocks" :key="index">
      <BlogHeading v-if="block.type === 'heading'" :block="block" />
      <BlogParagraph v-else-if="block.type === 'paragraph'" :block="block" />
      <BlogList v-else-if="block.type === 'list'" :block="block" />
      <BlogQuote v-else-if="block.type === 'quote'" :block="block" />
      <BlogParagraph v-else :block="block" />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { StrapiBlock } from '~/types/blog'

interface Props {
  content: string | StrapiBlock[]
}

const props = defineProps<Props>()

const blocks = computed(() => {
  if (typeof props.content === 'string') {
    return [{ type: 'paragraph', children: [{ type: 'text', text: props.content }] }]
  }
  if (!Array.isArray(props.content)) {
    console.warn('BlogContent: content is not an array', props.content)
    return []
  }
  const filtered = props.content.filter(block => {
    if (!block || !block.type) return false
    if (block.type === 'heading' && block.children) {
      return block.children.some((child: any) => child?.text && child.text.trim())
    }
    if (block.type === 'paragraph' && block.children) {
      return block.children.some((child: any) => child?.text && child.text.trim())
    }
    return true
  })
  console.log('BlogContent: filtered blocks', filtered)
  return filtered
})
</script>

