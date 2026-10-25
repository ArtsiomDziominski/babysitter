<template>
  <div class="mb-6 max-xl:mb-4 overflow-x-auto scrollbar-hide">
    <UTabs
      :model-value="selectedStatus ?? ALL"
      :items="tabs"
      :content="false"
      variant="link"
      class="w-max min-w-full"
      @update:model-value="$emit('update:selectedStatus', $event === ALL ? null : String($event))"
    />
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

const ALL = 'all'

defineProps<{
  selectedStatus: string | null
}>()

defineEmits<{
  'update:selectedStatus': [value: string | null]
}>()

const tabs = computed(() => [
  { value: ALL, label: t('account.orders.tabs.all') },
  { value: 'pending', label: t('account.orders.status.pending') },
  { value: 'confirmed', label: t('account.orders.status.confirmed') },
  { value: 'in_progress', label: t('account.orders.status.in_progress') },
  { value: 'completed', label: t('account.orders.status.completed') },
  { value: 'cancelled', label: t('account.orders.status.cancelled') }
])
</script>
