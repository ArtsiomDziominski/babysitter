<template>
  <div class="flex flex-col items-center gap-4">
    <div class="relative group">
      <div class="w-[140px] h-[140px] rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
        <img
          v-if="photoSrc"
          :src="photoSrc"
          alt="Фото профиля"
          class="w-full h-full object-cover"
        />
        <div
          v-else
          class="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500"
        >
          <Icon name="mdi:camera-outline" size="48" />
        </div>
      </div>
      <div
        v-if="hasPhoto"
        class="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-error-500 flex items-center justify-center cursor-pointer hover:bg-error-600 transition-colors shadow-lg"
        @click.stop="handleDeletePhoto"
        :class="{ 'opacity-50 cursor-not-allowed': isDeletingPhoto }"
      >
        <Icon
          name="mdi:close"
          size="20"
          class="text-white"
        />
      </div>
      <div
        class="absolute inset-0 bg-black/0 hover:bg-black/10 dark:hover:bg-black/30 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        @click="() => fileInput?.click()"
        :class="{ 'opacity-50 cursor-not-allowed': isUploadingPhoto || isDeletingPhoto }"
      >
        <Icon
          v-if="!isUploadingPhoto"
          name="mdi:camera"
          size="32"
          class="text-white drop-shadow-lg"
        />
        <UIcon
          v-else
          name="i-heroicons-arrow-path"
          size="32"
          class="text-white drop-shadow-lg animate-spin"
        />
      </div>
      
      <input
        ref="fileInput"
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        class="hidden"
        @change="handleFileSelect"
      />
    </div>
    <div class="flex flex-col gap-2 w-full">
      <UButton
        variant="outline"
        color="primary"
        size="sm"
        :loading="isUploadingPhoto"
        :disabled="isUploadingPhoto || isDeletingPhoto"
        @click="() => fileInput?.click()"
        class="w-full"
      >
        {{ hasPhoto ? $t('account.nannyForm.changePhoto') : $t('account.nannyForm.uploadPhoto') }}
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const authStore = useAuthStore()
const toast = useToast()

const fileInput = ref<HTMLInputElement | null>(null)
const photoPreview = ref<string | null>(null)
const isUploadingPhoto = ref(false)
const isDeletingPhoto = ref(false)

const hasPhoto = computed(() => {
  return !!authStore.currentUser?.avatar || !!photoPreview.value
})

const photoSrc = computed(() => {
  return photoPreview.value || authStore.currentUser?.avatar || null
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
    photoPreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)

  isUploadingPhoto.value = true
  try {
    const profile = useProfile()
    await profile.uploadAvatar(file)
    await authStore.fetchProfile()
    photoPreview.value = null
    toast.add({
      title: t('account.nannyForm.photoUploadSuccess'),
      color: 'success'
    })
  } catch (error) {
    console.error('Ошибка при загрузке фото:', error)
    toast.add({
      title: t('account.basicData.errors.title'),
      description: t('account.basicData.errors.uploadFailed'),
      color: 'error'
    })
    photoPreview.value = null
    target.value = ''
  } finally {
    isUploadingPhoto.value = false
  }
}

const handleDeletePhoto = async () => {
  isDeletingPhoto.value = true
  try {
    const profile = useProfile()
    await profile.deleteAvatar()
    await authStore.fetchProfile()
    photoPreview.value = null
    if (fileInput.value) {
      fileInput.value.value = ''
    }
    toast.add({
      title: t('account.nannyForm.photoDeleteSuccess'),
      color: 'success'
    })
  } catch (error) {
    console.error('Ошибка при удалении фото:', error)
    toast.add({
      title: t('account.basicData.errors.title'),
      description: t('account.basicData.errors.deleteFailed'),
      color: 'error'
    })
  } finally {
    isDeletingPhoto.value = false
  }
}

defineExpose({
  hasPhoto
})
</script>

