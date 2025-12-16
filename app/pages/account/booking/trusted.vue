<template>
  <div class="flex-1">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ $t('account.booking.trustedPerson.title') }}
        </h1>
        <UButton
            v-if="contacts.length < 10"
            variant="outline"
            color="primary"
            @click="addContact"
        >
          {{ $t('account.booking.trustedPerson.add') }}
        </UButton>
      </div>

      <p class="text-gray-600 dark:text-gray-400 mb-8">
        {{ $t('account.booking.trustedPerson.description') }}
      </p>

      <div v-if="isLoading" class="flex items-center justify-center py-12">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-primary animate-spin" />
      </div>

      <template v-else>
        <div v-if="!contacts.length" class="text-center py-12 text-gray-500 dark:text-gray-400">
          <p class="text-lg mb-4">{{ $t('account.booking.trustedPerson.noContacts') }}</p>
          <UButton
              color="primary"
              @click="addContact"
          >
            {{ $t('account.booking.trustedPerson.add') }}
          </UButton>
        </div>

        <div v-if="contacts.length > 0" class="space-y-4">
          <PageAccountBookingTrustedContactCard
              v-for="contact in contacts"
              :key="contact.id"
              :contact="contact"
              :is-deleting="deletingContactId === contact.id"
              @remove="() => openDeleteModal(contact.id!, contact)"
              @edit="() => editContact(contact)"
          />
        </div>
      </template>
    </div>

    <PageAccountBookingTrustedContactModal
        v-model="isModalOpen"
        :contact="newContact"
        :is-saving="isSaving"
        :is-edit="isEditMode"
        @update:contact="updateNewContact"
        @save="handleSave"
        @close="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import type { TrustedContact } from '~/composables/useTrustedContacts'

const { t } = useI18n()
const modalStore = useModalStore()
const { createTrustedContact, deleteTrustedContact, getTrustedContacts, updateTrustedContact } = useTrustedContacts()
const toast = useToast()

definePageMeta({
  middleware: 'auth'
})

const contacts = ref<TrustedContact[]>([])
const isSaving = ref(false)
const isModalOpen = ref(false)
const newContact = ref<TrustedContact | null>(null)
const deletingContactId = ref<number | null>(null)
const isLoading = ref(true)
const isEditMode = ref(false)

const loadContacts = async () => {
  isLoading.value = true
  try {
    const contactsData = await getTrustedContacts()
    console.log(contactsData)
    contacts.value = contactsData
  } catch (error) {
    console.error('Ошибка при загрузке доверенных лиц:', error)
    contacts.value = []
    toast.add({
      title: t('account.booking.trustedPerson.loadError'),
      color: 'error'
    })
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadContacts()
})

const addContact = () => {
  newContact.value = {
    firstName: '',
    lastName: '',
    phone: '+7',
    relationship: null,
  }
  isEditMode.value = false
  isModalOpen.value = true
}

const editContact = (contact: TrustedContact) => {
  newContact.value = { ...contact }
  isEditMode.value = true
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  newContact.value = null
  isEditMode.value = false
}

const updateNewContact = (updatedContact: TrustedContact) => {
  if (newContact.value) {
    newContact.value = { ...updatedContact }
  }
}

const openDeleteModal = (id: number, contact: TrustedContact) => {
  modalStore.open({
    title: t('account.booking.trustedPerson.confirmDeleteTitle'),
    description: t('account.booking.trustedPerson.confirmDeleteMessage', {
      name: `${contact.lastName} ${contact.firstName}`
    }),
    actions: [
      {
        label: t('account.security.cancel'),
        variant: 'outline',
        handler: () => {
          modalStore.close()
        }
      },
      {
        label: t('account.booking.trustedPerson.confirmDelete'),
        color: 'error',
        handler: async () => {
          await confirmDelete(id)
        }
      }
    ]
  })
}

const confirmDelete = async (id: number) => {
  deletingContactId.value = id
  modalStore.updateAction(1, { loading: true, disabled: true })

  try {
    await deleteTrustedContact(id)
    await loadContacts()
    toast.add({
      title: t('account.booking.trustedPerson.deleteSuccess'),
      color: 'success'
    })
    modalStore.close()
  } catch (error: any) {
    console.error('Ошибка при удалении доверенного лица:', error)
    toast.add({
      title: t('account.booking.trustedPerson.deleteError'),
      description: error.message || t('account.booking.trustedPerson.deleteErrorMessage'),
      color: 'error'
    })
  } finally {
    deletingContactId.value = null
    modalStore.updateAction(1, { loading: false, disabled: false })
  }
}

const handleSave = async () => {
  if (!newContact.value || !newContact.value.firstName.trim() || !newContact.value.lastName.trim() || !newContact.value.phone.trim()) {
    return
  }

  isSaving.value = true
  try {
    const payload: any = {
      firstName: newContact.value.firstName.trim(),
      lastName: newContact.value.lastName.trim(),
      phone: newContact.value.phone.trim(),
    }

    if (newContact.value.relationship?.trim()) {
      payload.relationship = newContact.value.relationship.trim()
    }

    if (isEditMode.value && newContact.value.id) {
      await updateTrustedContact(newContact.value.id, payload)
    } else {
      await createTrustedContact(payload)
    }
    await loadContacts()
    closeModal()
    toast.add({
      title: isEditMode.value ? t('account.booking.trustedPerson.updateSuccess') : t('account.booking.trustedPerson.addSuccess'),
      color: 'success'
    })
  } catch (error: any) {
    console.error('Ошибка при сохранении:', error)
    toast.add({
      title: isEditMode.value ? t('account.booking.trustedPerson.updateError') : t('account.booking.trustedPerson.addError'),
      description: error.message || t('account.booking.trustedPerson.saveErrorMessage'),
      color: 'error'
    })
  } finally {
    isSaving.value = false
  }
}
</script>

