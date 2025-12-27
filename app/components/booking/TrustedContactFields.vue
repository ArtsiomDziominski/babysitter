<template>
  <div class="space-y-4">
    <div class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4">
      <div class="flex items-center justify-between">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {{ $t('account.booking.trustedPerson.title') }}
        </label>
        <UButton
          v-if="!selectedTrustedContact"
          variant="outline"
          color="primary"
          size="sm"
          @click="addNewContactForm"
        >
          <Icon name="i-lucide-plus" size="16" class="mr-2" />
          {{ $t('account.booking.trustedPerson.add') }}
        </UButton>
      </div>

      <div v-if="newContactForm" class="space-y-3">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <UInput
              v-model="newContactForm.lastName"
              :placeholder="$t('account.booking.trustedPerson.lastNamePlaceholder')"
              size="lg"
              maxlength="100"
            />
          </div>
          <div>
            <UInput
              v-model="newContactForm.firstName"
              :placeholder="$t('account.booking.trustedPerson.firstNamePlaceholder')"
              size="lg"
              maxlength="100"
            />
          </div>
        </div>
        <div>
          <UInput
            v-model="newContactForm.phone"
            :placeholder="$t('account.booking.trustedPerson.phonePlaceholder')"
            size="lg"
            maxlength="20"
          />
        </div>
        <div>
          <UInput
            v-model="newContactForm.relationship"
            :placeholder="$t('account.booking.trustedPerson.relationshipPlaceholder')"
            size="lg"
            maxlength="100"
          />
        </div>
        <div class="flex gap-2">
          <UButton
            color="primary"
            size="lg"
            :disabled="!newContactForm.firstName || !newContactForm.lastName || !newContactForm.phone"
            @click="addContactFromForm"
          >
            {{ $t('account.booking.trustedPerson.add') }}
          </UButton>
          <UButton
            variant="ghost"
            color="error"
            size="lg"
            @click="removeNewContactForm"
          >
            <Icon name="i-lucide-x" size="16" />
          </UButton>
        </div>
      </div>

      <div v-if="selectedTrustedContact" class="space-y-2">
        <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div>
            <span class="font-medium">{{ selectedTrustedContact.lastName }} {{ selectedTrustedContact.firstName }}</span>
            <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              <span>{{ selectedTrustedContact.phone }}</span>
              <span v-if="selectedTrustedContact.relationship" class="ml-2">
                ({{ selectedTrustedContact.relationship }})
              </span>
            </div>
          </div>
          <UButton
            variant="ghost"
            color="error"
            size="sm"
            @click="removeContact"
          >
            <Icon name="i-lucide-x" size="16" />
          </UButton>
        </div>
      </div>

      <div v-else class="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
        {{ $t('account.booking.trustedPerson.noContacts') }}
      </div>

      <div v-if="profileContacts.length > 0 && availableProfileContacts.length > 0" class="pt-4 border-t border-gray-200 dark:border-gray-700">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          {{ $t('account.booking.trustedPerson.description') }}
        </label>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <UButton
            v-for="contact in availableProfileContacts"
            :key="contact.id"
            variant="outline"
            color="primary"
            class="justify-start"
            @click="addContactFromProfile(contact)"
          >
            <div class="flex items-center gap-2">
              <Icon name="i-lucide-plus" size="16" />
              <span>{{ contact.lastName }} {{ contact.firstName }}</span>
              <span v-if="contact.relationship" class="text-gray-500">
                ({{ contact.relationship }})
              </span>
            </div>
          </UButton>
        </div>
      </div>

      <div v-if="profileContacts.length === 0" class="pt-4 border-t border-gray-200 dark:border-gray-700">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ $t('account.booking.trustedPerson.noContacts') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TrustedContact } from '~/composables/useTrustedContacts'

const props = defineProps<{
  selectedTrustedContact: TrustedContact | null
}>()

const emit = defineEmits<{
  'update:selectedTrustedContact': [value: TrustedContact | null]
}>()

const { getTrustedContacts } = useTrustedContacts()

const profileContacts = ref<TrustedContact[]>([])
const isLoading = ref(false)

interface NewContactForm {
  firstName: string
  lastName: string
  phone: string
  relationship?: string | null
}

const newContactForm = ref<NewContactForm | null>(null)

const selectedTrustedContact = computed({
  get: () => props.selectedTrustedContact,
  set: (value) => emit('update:selectedTrustedContact', value)
})

const availableProfileContacts = computed(() => {
  if (selectedTrustedContact.value) {
    return []
  }
  return profileContacts.value
})

const loadProfileContacts = async () => {
  isLoading.value = true
  try {
    const contacts = await getTrustedContacts()
    profileContacts.value = contacts
    autoAddSingleContact()
  } catch (error) {
    console.error('Ошибка загрузки доверенных лиц:', error)
    profileContacts.value = []
  } finally {
    isLoading.value = false
  }
}

const autoAddSingleContact = () => {
  if (profileContacts.value.length === 1 && !props.selectedTrustedContact) {
    const contact = profileContacts.value[0]
    if (contact) {
      addContactFromProfile(contact)
    }
  }
}

const addContactFromProfile = (contact: TrustedContact) => {
  if (!contact.firstName || !contact.lastName || !contact.phone) {
    return
  }

  emit('update:selectedTrustedContact', contact)
}

const removeContact = () => {
  emit('update:selectedTrustedContact', null)
}

const addNewContactForm = () => {
  if (props.selectedTrustedContact) {
    return
  }
  newContactForm.value = {
    firstName: '',
    lastName: '',
    phone: '+7',
    relationship: null
  }
}

const removeNewContactForm = () => {
  newContactForm.value = null
}

const addContactFromForm = () => {
  if (!newContactForm.value) {
    return
  }

  if (!newContactForm.value.firstName || !newContactForm.value.lastName || !newContactForm.value.phone) {
    return
  }

  const newContact: TrustedContact = {
    firstName: newContactForm.value.firstName.trim(),
    lastName: newContactForm.value.lastName.trim(),
    phone: newContactForm.value.phone.trim(),
    relationship: newContactForm.value.relationship?.trim() || null
  }

  emit('update:selectedTrustedContact', newContact)
  removeNewContactForm()
}

onMounted(() => {
  loadProfileContacts()
})
</script>

