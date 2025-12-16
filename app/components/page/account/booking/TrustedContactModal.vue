<template>
  <UModal v-model:open="isOpen" :title="isEdit ? $t('account.booking.trustedPerson.edit') : $t('account.booking.trustedPerson.add')">
    <template #body>
      <div v-if="contact">
        <PageAccountBookingTrustedContactForm
            :contact="contact"
            @update:contact="$emit('update:contact', $event)"
        />
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-3">
        <UButton
            variant="outline"
            @click="handleClose"
        >
          {{ $t('account.security.cancel') }}
        </UButton>
        <UButton
            color="primary"
            :loading="isSaving"
            :disabled="!canSave"
            @click="$emit('save')"
        >
          {{ $t('account.basicData.save') }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { TrustedContact } from '~/composables/useTrustedContacts'

interface Props {
  modelValue: boolean
  contact: TrustedContact | null
  isSaving?: boolean
  isEdit?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isSaving: false,
  isEdit: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'update:contact': [contact: TrustedContact]
  'save': []
  'close': []
}>()

const isEdit = computed(() => props.isEdit && props.contact?.id !== undefined)

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const canSave = computed(() => {
  if (!props.contact) return false
  return props.contact.firstName?.trim() && 
         props.contact.lastName?.trim() && 
         props.contact.phone?.trim()
})

const handleClose = () => {
  emit('close')
  isOpen.value = false
}
</script>

