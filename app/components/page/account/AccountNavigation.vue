<script setup lang="ts">
import { UserRole } from '~/const/roles'

const authStore = useAuthStore()
const { t } = useI18n()
const localePath = useLocalePath()

const props = defineProps<{
  activeTab: string
}>()

const items = computed(() => [
  {
    label: t('account.messages.title'),
    icon: 'i-lucide-message-square',
    to: localePath('/account/messages'),
    active: props.activeTab === 'messages'
  },
  {
    label: t('account.orders.title'),
    icon: 'i-lucide-clipboard-list',
    to: localePath('/account/orders'),
    active: props.activeTab === 'orders'
  },
  ...(authStore.user.role === UserRole.BABYSITTER ? [] : [{
    label: t('favorites.title'),
    icon: 'i-lucide-heart',
    to: localePath('/account/favorites'),
    active: props.activeTab === 'favorites'
  }]),
  {
    label: t('account.booking.title'),
    icon: 'i-lucide-baby',
    to: localePath(authStore.user.role === UserRole.PARENT ? '/account/booking/kids' : '/account/booking/babysitter'),
    active: props.activeTab === 'booking'
  },
  {
    label: t('account.profile'),
    icon: 'i-lucide-user',
    to: localePath('/account/profile'),
    active: props.activeTab === 'profile'
  }
])
</script>

<template>
  <aside class="lg:w-64 shrink-0">
    <div class="lg:sticky lg:top-[calc(var(--ui-header-height)+2rem)] space-y-4">
      <div class="max-lg:hidden flex items-center gap-3 rounded-lg border border-default bg-default p-4">
        <UserAvatar size="lg" />
        <div class="min-w-0">
          <p class="font-semibold text-highlighted truncate">{{ authStore.currentUser?.name }}</p>
          <p class="text-sm text-muted truncate">{{ authStore.currentUser?.email }}</p>
        </div>
      </div>

      <UNavigationMenu
        :items="items"
        orientation="vertical"
        class="max-lg:hidden"
      />

      <div class="lg:hidden -mx-4 px-4 overflow-x-auto scrollbar-hide border-b border-default">
        <UNavigationMenu
          :items="items"
          orientation="horizontal"
          variant="pill"
          class="w-max"
          :ui="{ linkLabel: 'overflow-visible' }"
        />
      </div>
    </div>
  </aside>
</template>
