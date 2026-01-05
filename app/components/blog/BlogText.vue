<template>
  <component :is="tag" :class="textClasses">
    {{ text }}
  </component>
</template>

<script setup lang="ts">
interface Props {
  child: {
    type: string
    text?: string
    bold?: boolean
    italic?: boolean
    underline?: boolean
    strikethrough?: boolean
    code?: boolean
  }
}

const props = defineProps<Props>()

const text = computed(() => props.child?.text || '')

const tag = computed(() => {
  if (props.child?.code) return 'code'
  return 'span'
})

const textClasses = computed(() => {
  const classes: string[] = []
  
  if (props.child?.bold) classes.push('font-bold')
  if (props.child?.italic) classes.push('italic')
  if (props.child?.underline) classes.push('underline')
  if (props.child?.strikethrough) classes.push('line-through')
  if (props.child?.code) {
    classes.push('bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono')
  }
  
  return classes.join(' ')
})
</script>

