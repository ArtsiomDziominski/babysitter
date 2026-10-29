<template>
  <button
    v-if="!isBabysitter"
    type="button"
    class="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md rounded-full p-2 hover:bg-muted transition-all shadow-lg hover:scale-110 active:scale-95 disabled:opacity-70"
    :aria-label="active ? $t('favorites.remove') : $t('favorites.add')"
    :aria-pressed="active"
    :title="active ? $t('favorites.remove') : $t('favorites.add')"
    :disabled="isSaving"
    @click.stop.prevent="handleClick"
  >
    <Icon
      :name="active ? 'i-mdi-heart' : 'i-lucide-heart'"
      :class="active ? 'text-error-500' : 'text-toned'"
      :size="size"
    />
  </button>
</template>

<script setup lang="ts">
import { UserRole } from '~/const/roles'

const props = withDefaults(defineProps<{
  babysitterId: number | string
  size?: string | number
}>(), {
  size: 18
})

const authStore = useAuthStore()
const { isFavorite, loadIds, toggleFavorite } = useFavorites()
const toast = useToast()
const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const localePath = useLocalePath()

const isSaving = ref(false)
const isBabysitter = computed(() => authStore.currentUser?.role === UserRole.BABYSITTER)
const active = computed(() => isFavorite(props.babysitterId))

onMounted(() => {
  loadIds().catch(() => {})
})

const handleClick = async () => {
  if (!authStore.isAuthenticated) {
    toast.add({ title: t('favorites.loginRequired'), color: 'info' })
    await router.push(localePath({ path: '/login', query: { redirect: route.fullPath } }))
    return
  }
  isSaving.value = true
  try {
    const added = await toggleFavorite(props.babysitterId)
    toast.add({ title: added ? t('favorites.added') : t('favorites.removed'), color: 'success' })
  } catch {
    toast.add({ title: t('favorites.error'), color: 'error' })
  } finally {
    isSaving.value = false
  }
}
</script>
