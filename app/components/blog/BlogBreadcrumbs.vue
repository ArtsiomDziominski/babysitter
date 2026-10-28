<template>
  <div class="mb-6 flex items-center gap-4">
    <UButton
      variant="ghost"
      icon="i-lucide-arrow-left"
      @click="router.push(localePath('/blog'))"
    />
    <nav class="flex items-center gap-2 text-sm text-toned">
      <NuxtLinkLocale to="/" class="hover:text-primary transition-colors">
        {{ $t('blog.breadcrumbs.home') }}
      </NuxtLinkLocale>
      <Icon name="i-lucide-chevron-right" size="16" />
      <NuxtLinkLocale to="/blog" class="hover:text-primary transition-colors">
        {{ $t('blog.title') }}
      </NuxtLinkLocale>
      <template v-if="articleTitle">
        <Icon name="i-lucide-chevron-right" size="16" />
        <span class="text-highlighted">{{ articleTitle }}</span>
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
const localePath = useLocalePath()
</script>

