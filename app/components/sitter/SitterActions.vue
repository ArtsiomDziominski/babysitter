<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
    <div class="space-y-3">
      <div v-if="isBabysitter" class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
        <p class="text-sm text-gray-600 dark:text-gray-400 text-center">
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
