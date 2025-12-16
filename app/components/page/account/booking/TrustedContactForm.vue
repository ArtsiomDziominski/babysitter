<template>
  <div class="space-y-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ $t('account.booking.trustedPerson.lastName') }}
        </label>
        <UInput
            :model-value="localContact.lastName"
            :placeholder="$t('account.booking.trustedPerson.lastNamePlaceholder')"
            size="lg"
            required
            @update:model-value="updateField('lastName', $event)"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ $t('account.booking.trustedPerson.firstName') }}
        </label>
        <UInput
            :model-value="localContact.firstName"
            :placeholder="$t('account.booking.trustedPerson.firstNamePlaceholder')"
            size="lg"
            required
            @update:model-value="updateField('firstName', $event)"
        />
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {{ $t('account.booking.trustedPerson.phone') }}
      </label>
      <UInput
          :model-value="localContact.phone"
          :placeholder="$t('account.booking.trustedPerson.phonePlaceholder')"
          size="lg"
          required
          @update:model-value="updateField('phone', $event)"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {{ $t('account.booking.trustedPerson.relationship') }}
      </label>
      <UInput
          :model-value="localContact.relationship || ''"
          :placeholder="$t('account.booking.trustedPerson.relationshipPlaceholder')"
          size="lg"
          @update:model-value="updateField('relationship', $event || null)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TrustedContact } from '~/composables/useTrustedContacts'

interface Props {
  contact: TrustedContact
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:contact': [contact: TrustedContact]
}>()

const localContact = computed(() => props.contact)

const updateField = (field: keyof TrustedContact, value: any) => {
  emit('update:contact', {
    ...localContact.value,
    [field]: value
  })
}
</script>

