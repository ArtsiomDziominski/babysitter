<template>
  <div class="mb-6 flex items-center gap-4">
    <UButton
      variant="ghost"
      icon="i-lucide-arrow-left"
      @click="router.push('/blog')"
    />
    <nav class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
      <NuxtLink to="/" class="hover:text-primary-500 transition-colors">
        {{ $t('blog.breadcrumbs.home') }}
      </NuxtLink>
      <Icon name="i-lucide-chevron-right" size="16" />
      <NuxtLink to="/blog" class="hover:text-primary-500 transition-colors">
        {{ $t('blog.title') }}
      </NuxtLink>
      <template v-if="articleTitle">
        <Icon name="i-lucide-chevron-right" size="16" />
        <span class="text-gray-900 dark:text-white">{{ articleTitle }}</span>
      </template>
    </nav>
  </div>
</template>

<script setup lang="ts">
interface Props {
  articleTitle?: string
}

defineProps<Props>()

const router = useRouter()
</script>

