<template>
  <div class="relative w-full h-[400px] lg:h-[500px] bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
    <img
      v-if="sitter.avatar"
      :src="sitter.avatar"
      :alt="sitter.name"
      class="w-full h-full object-cover"
    />
    <div
      v-else
      class="w-full h-full flex items-center justify-center text-gray-400"
    >
      <Icon name="i-lucide-user" size="96" />
    </div>
    
    <div class="absolute top-4 right-4 flex gap-2">
      <button
        class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full p-2 hover:bg-white dark:hover:bg-gray-800 transition-colors"
        @click="$emit('toggle-favorite')"
      >
        <Icon
          :name="isFavorite ? 'i-lucide-heart' : 'i-lucide-heart'"
          :class="isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-600 dark:text-gray-400'"
          size="20"
        />
      </button>
      <button
        class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full p-2 hover:bg-white dark:hover:bg-gray-800 transition-colors"
      >
        <Icon name="i-lucide-flag" size="20" class="text-gray-600 dark:text-gray-400" />
      </button>
    </div>

    <div
      v-if="sitter.isOnline"
      class="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs flex items-center gap-1"
    >
      <div class="w-2 h-2 bg-green-400 rounded-full"></div>
      Ситтер онлайн
    </div>
    <div
      v-else-if="sitter.lastSeenOnline"
      class="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs"
    >
      Был в онлайне {{ formatLastSeen(sitter.lastSeenOnline) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Sitter } from '~/types/sitter'
import { useSitterUtils } from '~/composables/useSitterUtils'

defineProps<{
  sitter: Sitter
  isFavorite: boolean
}>()

defineEmits<{
  'toggle-favorite': []
}>()

const { formatLastSeen } = useSitterUtils()
</script>
