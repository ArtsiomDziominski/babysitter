<template>
  <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
    <div class="flex items-start justify-between mb-4">
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {{ contact.lastName }} {{ contact.firstName }}
        </h3>
        <div class="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
          <span>
            {{ $t('account.booking.trustedPerson.phone') }}: {{ contact.phone }}
          </span>
          <span v-if="contact.relationship">
            {{ $t('account.booking.trustedPerson.relationship') }}: {{ contact.relationship }}
          </span>
        </div>
      </div>
      <div class="flex gap-2">
        <UButton
            variant="ghost"
            color="primary"
            size="sm"
            :disabled="isDeleting"
            @click="$emit('edit')"
        >
          {{ $t('account.booking.trustedPerson.edit') }}
        </UButton>
        <UButton
            variant="ghost"
            color="red"
            size="sm"
            :loading="isDeleting"
            :disabled="isDeleting"
            @click="$emit('remove')"
        >
          {{ $t('account.booking.trustedPerson.remove') }}
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TrustedContact } from '~/composables/useTrustedContacts'

interface Props {
  contact: TrustedContact
  isDeleting?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isDeleting: false
})

const emit = defineEmits<{
  'remove': []
  'edit': []
}>()
</script>

