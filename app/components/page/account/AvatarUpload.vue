<template>
  <div class="flex flex-col items-center max-xl:w-full">
    <div class="relative mb-4">
      <UserAvatar
        :preview="avatarPreview"
        size="3xl"
        class="border-4 border-gray-200 dark:border-gray-700 w-36 h-36 max-xl:w-28 max-xl:h-28"
        :show-fallback="true"
      />
      
      <input
        ref="fileInput"
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        class="hidden"
        @change="handleFileSelect"
      />
    </div>
    <div class="flex flex-col gap-2 max-xl:w-full">
      <UButton
        variant="outline"
        color="primary"
        class="max-xl:w-full"
        :loading="isUploadingAvatar"
        :disabled="isUploadingAvatar || isDeletingAvatar"
        @click="() => fileInput?.click()"
      >
        {{ $t('account.basicData.uploadPhoto') }}
      </UButton>
      <UButton
        v-if="hasAvatar"
        variant="outline"
        color="error"
        class="max-xl:w-full"
        :loading="isDeletingAvatar"
        :disabled="isUploadingAvatar || isDeletingAvatar"
        @click="handleDeleteAvatar"
      >
        {{ $t('account.basicData.deletePhoto') }}
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const authStore = useAuthStore()
const toast = useToast()

const fileInput = ref<HTMLInputElement | null>(null)
const avatarPreview = ref<string | null>(null)
const isUploadingAvatar = ref(false)
const isDeletingAvatar = ref(false)

const hasAvatar = computed(() => {
  return !!authStore.currentUser?.avatar || !!avatarPreview.value
})

const ALLOWED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp']
const MAX_FILE_SIZE = 5 * 1024 * 1024

const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  const fileExtension = file.name.split('.').pop()?.toLowerCase()
  const isValidFormat = ALLOWED_FORMATS.includes(file.type) ||
    ALLOWED_EXTENSIONS.includes(fileExtension || '')

  if (!isValidFormat) {
    toast.add({
      title: t('account.basicData.errors.title'),
      description: t('account.basicData.errors.invalidFormat'),
      color: 'error'
    })
    target.value = ''
    return
  }

  if (file.size > MAX_FILE_SIZE) {
    toast.add({
      title: t('account.basicData.errors.title'),
      description: t('account.basicData.errors.fileTooLarge'),
      color: 'error'
    })
    target.value = ''
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    avatarPreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)

  isUploadingAvatar.value = true
  try {
    const profile = useProfile()
    await profile.uploadAvatar(file)
    await authStore.fetchProfile()
    avatarPreview.value = null
  } catch (error) {
    console.error('Ошибка при загрузке аватара:', error)
    toast.add({
      title: t('account.basicData.errors.title'),
      description: t('account.basicData.errors.uploadFailed'),
      color: 'error'
    })
    avatarPreview.value = null
    target.value = ''
  } finally {
    isUploadingAvatar.value = false
  }
}

const handleDeleteAvatar = async () => {
  isDeletingAvatar.value = true
  try {
    const profile = useProfile()
    await profile.deleteAvatar()
    await authStore.fetchProfile()
    avatarPreview.value = null
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  } catch (error) {
    console.error('Ошибка при удалении аватара:', error)
    toast.add({
      title: t('account.basicData.errors.title'),
      description: t('account.basicData.errors.deleteFailed'),
      color: 'error'
    })
  } finally {
    isDeletingAvatar.value = false
  }
}
</script>

