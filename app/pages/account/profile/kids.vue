<template>
  <div class="flex-1">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ $t('account.children.title') }}
        </h1>
        <UButton
            variant="outline"
            color="primary"
            @click="addChild"
        >
          {{ $t('account.children.addChild') }}
        </UButton>
      </div>

      <div v-if="isLoading" class="flex items-center justify-center py-12">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-primary animate-spin" />
      </div>

      <template v-else>
        <div v-if="children.length === 0" class="text-center py-12 text-gray-500 dark:text-gray-400">
          <p class="text-lg mb-4">{{ $t('account.children.noChildren') }}</p>
          <UButton
              color="primary"
              @click="addChild"
          >
            {{ $t('account.children.addChild') }}
          </UButton>
        </div>

        <div v-if="existingChildren.length > 0" class="space-y-4">
          <PageAccountChildCard
              v-for="child in existingChildren"
              :key="child.id"
              :child="child"
              :is-deleting="deletingChildId === child.id"
              @remove="() => openDeleteModal(child.id!, child.name)"
              @edit="() => editChild(child)"
          />
        </div>
      </template>
    </div>

    <PageAccountAddChildModal
        v-model="isModalOpen"
        :child="newChild"
        :is-saving="isSaving"
        :is-edit="isEditMode"
        @update:child="updateNewChild"
        @save="handleSave"
        @close="closeModal"
    />

  </div>
</template>

<script setup lang="ts">
import type { Child } from '~/composables/useChildren'

const { t } = useI18n()
const authStore = useAuthStore()
const modalStore = useModalStore()
const { createChild, deleteChild, getChildren, updateChild } = useChildren()
const toast = useToast()

definePageMeta({
  middleware: 'auth'
})

const children = ref<Child[]>([])
const isSaving = ref(false)
const isModalOpen = ref(false)
const newChild = ref<Child | null>(null)
const deletingChildId = ref<number | null>(null)
const isLoading = ref(true)
const isEditMode = ref(false)

const existingChildren = computed(() => {
  return children.value.filter(child => child.id)
})

const loadChildren = async () => {
  isLoading.value = true
  try {
    const childrenData = (await getChildren())?.data
    const mappedChildren = childrenData.map((child: any) => ({
      ...child,
      age: child.age !== undefined && child.age !== null ? Number(child.age) : null,
    }))
    
    children.value = mappedChildren
    authStore.setChildren(mappedChildren)
  } catch (error) {
    console.error('Ошибка при загрузке детей:', error)
    children.value = []
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if (authStore.currentUser?.children && authStore.currentUser.children.length > 0) {
    const mappedChildren = authStore.currentUser.children.map((child: any) => ({
      ...child,
      age: child.age !== undefined && child.age !== null ? Number(child.age) : null,
    }))
    children.value = mappedChildren
    isLoading.value = false
  } else {
    loadChildren()
  }
})

const addChild = () => {
  newChild.value = {
    name: '',
    age: null,
    gender: 'male',
    allergies: null,
    specialNeeds: null,
    notes: null,
  }
  isEditMode.value = false
  isModalOpen.value = true
}

const editChild = (child: Child) => {
  newChild.value = { ...child }
  isEditMode.value = true
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  newChild.value = null
  isEditMode.value = false
}

const updateNewChild = (updatedChild: Child) => {
  if (newChild.value) {
    newChild.value = { ...updatedChild }
  }
}

const openDeleteModal = (id: number, name: string) => {
  modalStore.open({
    title: t('account.children.confirmDeleteTitle'),
    description: t('account.children.confirmDeleteMessage', { name }),
    actions: [
      {
        label: t('account.security.cancel'),
        variant: 'outline',
        handler: () => {
          modalStore.close()
        }
      },
      {
        label: t('account.children.confirmDelete'),
        color: 'error',
        handler: async () => {
          await confirmDelete(id)
        }
      }
    ]
  })
}

const confirmDelete = async (id: number) => {
  deletingChildId.value = id
  modalStore.updateAction(1, { loading: true, disabled: true })
  
  try {
    await deleteChild(id)
    await loadChildren()
    toast.add({
      title: t('account.children.deleteSuccess'),
      color: 'success'
    })
    modalStore.close()
  } catch (error: any) {
    console.error('Ошибка при удалении ребенка:', error)
    toast.add({
      title: t('account.children.deleteError'),
      description: error.message || t('account.children.deleteErrorMessage'),
      color: 'error'
    })
  } finally {
    deletingChildId.value = null
    modalStore.updateAction(1, { loading: false, disabled: false })
  }
}

const handleSave = async () => {
  if (!newChild.value || !newChild.value.name.trim()) {
    return
  }

  isSaving.value = true
  try {
    const payload: any = {}

    if (newChild.value.name.trim()) {
      payload.name = newChild.value.name.trim()
    }

    if (newChild.value.age !== null && newChild.value.age !== undefined && newChild.value.age >= 0 && newChild.value.age <= 18) {
      payload.age = newChild.value.age
    }

    if (newChild.value.specialNeeds?.trim()) {
      payload.specialNeeds = newChild.value.specialNeeds.trim()
    } else if (newChild.value.specialNeeds === '') {
      payload.specialNeeds = null
    }

    if (newChild.value.allergies?.trim()) {
      payload.allergies = newChild.value.allergies.trim()
    } else if (newChild.value.allergies === '') {
      payload.allergies = null
    }

    if (newChild.value.notes?.trim()) {
      payload.notes = newChild.value.notes.trim()
    } else if (newChild.value.notes === '') {
      payload.notes = null
    }

    if (isEditMode.value && newChild.value.id) {
      await updateChild(newChild.value.id, payload)
    } else {
      await createChild(payload)
    }
    await loadChildren()
    closeModal()
    toast.add({
      title: isEditMode.value ? t('account.children.updateSuccess') : t('account.children.addSuccess'),
      color: 'success'
    })
  } catch (error: any) {
    console.error('Ошибка при сохранении:', error)
    toast.add({
      title: isEditMode.value ? t('account.children.updateError') : t('account.children.addError'),
      description: error.message || t('account.children.saveErrorMessage'),
      color: 'error'
    })
  } finally {
    isSaving.value = false
  }
}
</script>
