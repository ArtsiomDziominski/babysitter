<template>
  <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 max-xl:p-4">
    <div class="flex items-start justify-between mb-4 max-xl:mb-3 max-xl:flex-col max-xl:gap-3">
      <div class="flex-1 max-xl:w-full">
        <h3 class="text-lg max-xl:text-base font-semibold text-gray-900 dark:text-white mb-2 max-xl:mb-1">
          {{ contact.lastName }} {{ contact.firstName }}
        </h3>
        <div class="flex flex-wrap gap-4 max-xl:gap-2 text-sm max-xl:text-xs text-gray-600 dark:text-gray-400">
          <span>
            {{ $t('account.booking.trustedPerson.phone') }}: {{ contact.phone }}
          </span>
          <span v-if="contact.relationship">
            {{ $t('account.booking.trustedPerson.relationship') }}: {{ contact.relationship }}
          </span>
        </div>
      </div>
      <div class="flex gap-2 max-xl:w-full max-xl:justify-end">
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

