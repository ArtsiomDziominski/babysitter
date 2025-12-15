<template>
  <ClientOnly>
    <UAvatar
      :src="avatarSrc"
      :alt="avatarAlt"
      :size="size"
      :class="avatarClass"
    />
    <template #fallback>
      <UAvatar
        v-if="showFallback"
        :size="size"
        :class="avatarClass"
        class="bg-gray-200 dark:bg-gray-700 animate-pulse"
      />
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
interface Props {
  src?: string | null
  alt?: string | null
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  preview?: string | null
  class?: string
  showFallback?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  showFallback: false,
})

const authStore = useAuthStore()

const avatarSrc = computed(() => {
  return props.preview || props.src || authStore.currentUser?.avatar
})

const avatarAlt = computed(() => {
  return props.alt || authStore.currentUser?.name || ''
})

const avatarClass = computed(() => {
  return props.class
})
</script>

