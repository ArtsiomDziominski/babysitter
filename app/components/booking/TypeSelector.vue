<template>
  <div class="mb-6">
    <div class="inline-flex rounded-lg border border-default bg-default p-1">
      <button
        type="button"
        @click="$emit('update:modelValue', 'offline')"
        class="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors"
        :class="modelValue === 'offline'
          ? 'bg-primary text-white'
          : 'text-default hover:bg-elevated'"
      >
        <Icon name="i-lucide-home" size="18" />
        <div class="text-left">
          <div class="font-semibold">{{ $t('account.booking.create.bookingType.offline.title') }}</div>
          <div class="text-xs opacity-90">{{ $t('account.booking.create.bookingType.offline.subtitle') }}</div>
        </div>
      </button>
      <button
        type="button"
        @click="$emit('update:modelValue', 'online')"
        class="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors"
        :class="modelValue === 'online'
          ? 'bg-primary text-white'
          : 'text-default hover:bg-elevated'"
      >
        <Icon name="i-lucide-video" size="18" />
        <div class="text-left">
          <div class="font-semibold">{{ $t('account.booking.create.bookingType.online.title') }}</div>
          <div class="text-xs opacity-90">{{ $t('account.booking.create.bookingType.online.subtitle') }}</div>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: 'offline' | 'online'
}>()

defineEmits<{
  'update:modelValue': [value: 'offline' | 'online']
}>()
</script>

