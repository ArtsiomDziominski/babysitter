<template>
  <div class="space-y-6">
    <div v-if="sitter.detailedDescription" class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
      <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
        {{ $t('bookings.sitter.sections.about') }}
      </h3>
      <p class="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
        {{ sitter.detailedDescription }}
      </p>
    </div>

    <div v-if="sitter.education" class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
      <div class="flex items-center gap-3 mb-4">
        <div class="p-2 bg-primary/10 rounded-lg">
          <Icon name="i-lucide-graduation-cap" size="24" class="text-primary-500" />
        </div>
        <h3 class="text-xl font-bold text-gray-900 dark:text-white">
          {{ $t('bookings.sitter.sections.education') }}
        </h3>
      </div>
      <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
        {{ sitter.education }}
      </p>
    </div>

    <div v-if="sitter.preferences" class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
      <div class="flex items-center gap-3 mb-4">
        <div class="p-2 bg-primary/10 rounded-lg">
          <Icon name="i-lucide-heart" size="24" class="text-primary-500" />
        </div>
        <h3 class="text-xl font-bold text-gray-900 dark:text-white">
          {{ $t('bookings.sitter.sections.preferences') }}
        </h3>
      </div>
      <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
        {{ sitter.preferences }}
      </p>
    </div>

    <div v-if="sitter.advantages && sitter.advantages.length > 0" class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
      <div class="flex items-center gap-3 mb-4">
        <div class="p-2 bg-primary/10 rounded-lg">
          <Icon name="i-lucide-award" size="24" class="text-primary-500" />
        </div>
        <h3 class="text-xl font-bold text-gray-900 dark:text-white">
          {{ $t('bookings.sitter.sections.advantages') }}
        </h3>
      </div>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="advantage in displayedAdvantages"
          :key="advantage"
          class="px-3 py-1.5 bg-primary/10 text-primary-700 dark:text-primary-300 rounded-lg text-sm font-medium"
        >
          {{ advantage }}
        </span>
      </div>
    </div>

    <div v-if="sitter.petAttitude" class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
      <div class="flex items-center gap-3 mb-4">
        <div class="p-2 bg-primary/10 rounded-lg">
          <Icon name="i-lucide-dog" size="24" class="text-primary-500" />
        </div>
        <h3 class="text-xl font-bold text-gray-900 dark:text-white">
          {{ $t('bookings.sitter.sections.petAttitude') }}
        </h3>
      </div>
      <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
        {{ sitter.petAttitude }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Sitter } from '~/types/sitter'
import { useAdvantages } from '~/composables/useAdvantages'

const props = defineProps<{
  sitter: Sitter
}>()

const { convertKeysToTranslations, convertAdvantagesToKeys } = useAdvantages()

const displayedAdvantages = computed(() => {
  if (!props.sitter.advantages?.length) return []
  const keys = convertAdvantagesToKeys(props.sitter.advantages)
  return convertKeysToTranslations(keys)
})
</script>

