<template>
  <div class="flex items-center gap-2 max-xl:flex-wrap max-xl:w-full">
    <template v-if="status === 'pending'">
      <UButton
        v-if="userRole === UserRole.BABYSITTER"
        size="sm"
        color="primary"
        class="cursor-pointer max-xl:flex-1"
        @click="$emit('action', orderId, 'confirm')"
      >
        {{ $t('account.orders.actions.confirm') }}
      </UButton>
      <UButton
        v-else
        size="sm"
        color="error"
        variant="outline"
        class="cursor-pointer max-xl:flex-1"
        @click="$emit('action', orderId, 'cancel')"
      >
        {{ $t('account.orders.actions.cancel') }}
      </UButton>
    </template>

    <UButton
      v-if="status === 'confirmed' || status === 'in_progress'"
      size="sm"
      color="error"
      variant="outline"
      class="cursor-pointer max-xl:flex-1"
      @click="$emit('action', orderId, 'cancel')"
    >
      {{ $t('account.orders.actions.cancel') }}
    </UButton>

    <template v-if="status === 'completed'">
      <UButton
        v-if="canLeaveReview"
        size="sm"
        variant="outline"
        class="cursor-pointer max-xl:flex-1"
        @click="$emit('action', orderId, 'review')"
      >
        {{ $t('account.orders.actions.review') }}
      </UButton>
      <UButton
        v-if="userRole !== UserRole.BABYSITTER"
        size="sm"
        color="primary"
        class="cursor-pointer max-xl:flex-1"
        @click="$emit('action', orderId, 'repeat')"
      >
        {{ $t('account.orders.actions.repeat') }}
      </UButton>
    </template>

    <UButton
      v-if="status === 'cancelled' && userRole !== UserRole.BABYSITTER"
      size="sm"
      color="primary"
      class="cursor-pointer max-xl:flex-1"
      @click="$emit('action', orderId, 'repeat')"
    >
      {{ $t('account.orders.actions.repeat') }}
    </UButton>
  </div>
</template>

<script setup lang="ts">
import { UserRole } from '~/const/roles'

const props = defineProps<{
  orderId: number
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  endTime?: string
  userRole?: string | null
}>()

defineEmits<{
  action: [id: number, action: string]
}>()

const canLeaveReview = computed(() => {
  if (props.status !== 'completed') return false
  if (!props.endTime) return true

  const endTime = new Date(props.endTime)
  const now = new Date()
  const weekInMs = 7 * 24 * 60 * 60 * 1000
  const timeDiff = now.getTime() - endTime.getTime()

  return timeDiff <= weekInMs
})
</script>

<style scoped>
:deep(.ui-button:not(:disabled)) {
  cursor: pointer;
}
</style>

