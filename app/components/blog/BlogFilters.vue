<template>
  <div :class="['bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6', $attrs.class]">
    <h2 v-if="!hideTitle" class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
      {{ $t('blog.filters') }}
    </h2>

    <div class="space-y-6">
      <div>
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          {{ $t('blog.categories') }}
        </h3>
        <div class="space-y-2">
          <UCheckbox
            :model-value="modelValue.selectedCategory === null"
            :label="$t('blog.allCategories')"
            @update:model-value="(val) => val && updateCategory(null)"
          />
          <UCheckbox
            v-for="category in categories"
            :key="category"
            :model-value="modelValue.selectedCategory === category"
            :label="getCategoryLabel(category)"
            @update:model-value="(val) => updateCategory(val ? category : null)"
          />
        </div>
      </div>

      <div>
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          {{ $t('blog.tags') }}
        </h3>
        <div class="space-y-2 max-h-64 sm:max-h-96 overflow-y-auto">
          <UCheckbox
            v-for="tag in tags"
            :key="tag"
            :model-value="modelValue.selectedTags.includes(tag)"
            :label="getTagLabel(tag)"
            @update:model-value="(val) => toggleTag(tag, !!val)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BlogFilters } from '~/types/blog'

const { t } = useI18n()

const props = defineProps<{
  modelValue: BlogFilters
  tags: string[]
  categories: string[]
  hideTitle?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: BlogFilters]
}>()

const modelValue = computed(() => props.modelValue)

const getCategoryLabel = (category: string) => {
  return t(`blog.categoryLabels.${category}`, category)
}

const getTagLabel = (tag: string) => {
  return t(`blog.tagLabels.${tag}`, tag)
}

const updateCategory = (category: string | null) => {
  emit('update:modelValue', {
    ...props.modelValue,
    selectedCategory: category
  })
}

const toggleTag = (tag: string, checked: boolean) => {
  const newTags = checked
    ? [...props.modelValue.selectedTags, tag]
    : props.modelValue.selectedTags.filter(t => t !== tag)
  
  emit('update:modelValue', {
    ...props.modelValue,
    selectedTags: newTags
  })
}
</script>
