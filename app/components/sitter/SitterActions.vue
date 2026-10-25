<template>
  <div class="bg-default rounded-xl border border-default p-4">
    <div class="space-y-3">
      <div v-if="isBabysitter" class="p-4 bg-muted dark:bg-default rounded-lg border border-default">
        <p class="text-sm text-toned text-center">
          {{ $t('bookings.sitter.actions.babysitterCannotBook') }}
        </p>
      </div>
      <UButton
        v-else
        color="primary"
        size="lg"
        block
        class="font-semibold"
        @click="$emit('contact')"
      >
        <Icon name="i-lucide-calendar-plus" size="20" class="mr-2" />
        {{ $t('bookings.sitter.actions.book') }}
      </UButton>
      <UButton
        v-if="!isBabysitter"
        variant="outline"
        size="lg"
        block
        class="font-semibold"
        @click="$emit('message')"
      >
        <Icon name="i-lucide-message-circle" size="20" class="mr-2" />
        {{ $t('bookings.sitter.actions.message') }}
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserRole } from '~/const/roles'

const authStore = useAuthStore()
const isBabysitter = computed(() => authStore.currentUser?.role === UserRole.BABYSITTER)

defineEmits<{
  contact: []
  message: []
}>()
</script>
