<template>
  <div v-if="hasProfile && !isEditing && !isLoading" class="flex gap-3">
    <UButton 
      :color="showInSearch ? 'neutral' : 'primary'" 
      variant="outline"
      :loading="isSaving"
      :disabled="isSaving"
      @click="handleToggleSearchVisibility"
    >
      {{ showInSearch ? t('account.nannyForm.hideFromSearch') : t('account.nannyForm.showInSearch') }}
    </UButton>
    <UButton variant="outline" @click="$emit('edit')">
      {{ t('account.nannyForm.edit') }}
    </UButton>
    <UButton color="error" variant="outline" :disabled="isSaving" @click="handleDelete">
      {{ t('account.nannyForm.delete') }}
    </UButton>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '#imports'

const props = defineProps<{
  hasProfile: boolean
  isEditing: boolean
  isLoading: boolean
  showInSearch: boolean
}>()

const emit = defineEmits<{
  edit: []
  deleted: []
  'update:showInSearch': [value: boolean]
}>()

const { t } = useI18n()
const babysitterApi = useBabysitter()
const authStore = useAuthStore()
const modalStore = useModalStore()
const toast = useToast()
const isSaving = ref(false)

const handleToggleSearchVisibility = async () => {
  isSaving.value = true
  try {
    const newValue = !props.showInSearch
    const response = await babysitterApi.toggleSearchVisibility(newValue)
    const updatedValue = response.showInSearch ?? newValue
    emit('update:showInSearch', updatedValue)
    toast.add({
      title: updatedValue
        ? t('account.nannyForm.showInSearchSuccess')
        : t('account.nannyForm.hideFromSearchSuccess'),
      color: 'success',
    })
    await authStore.fetchProfile()
  } catch (error: any) {
    toast.add({
      title: t('account.nannyForm.toggleSearchVisibilityError'),
      description: error.message || 'Попробуйте позже',
      color: 'error',
    })
  } finally {
    isSaving.value = false
  }
}

const handleDelete = () => {
  modalStore.open({
    title: t('account.nannyForm.confirmDeleteTitle'),
    description: t('account.nannyForm.confirmDeleteMessage'),
    actions: [
      {
        label: t('account.nannyForm.cancel'),
        variant: 'outline',
        handler: () => {
          modalStore.close()
        }
      },
      {
        label: t('account.nannyForm.delete'),
        color: 'error',
        handler: async () => {
          modalStore.close()
          isSaving.value = true
          try {
            await babysitterApi.deleteBabysitter()
            toast.add({
              title: t('account.nannyForm.deleteSuccess'),
              color: 'success',
            })
            await authStore.fetchProfile()
            emit('deleted')
          } catch (error: any) {
            toast.add({
              title: t('account.nannyForm.deleteError'),
              description: error.message || t('account.nannyForm.deleteErrorMessage'),
              color: 'error',
            })
          } finally {
            isSaving.value = false
          }
        }
      }
    ]
  })
}
</script>

