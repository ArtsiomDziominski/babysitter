<template>
  <div class="flex-1">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-8">
        {{ $t('account.basicData.title') }}
      </h1>

      <form @submit.prevent="handleSave" class="space-y-6">
        <div class="flex gap-8">
          <!-- Левая колонка с полями -->
          <div class="flex-1 space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ $t('account.basicData.name') }}
              </label>
              <UInput
                  v-model="formData.name"
                  :placeholder="$t('auth.namePlaceholder')"
                  size="lg"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ $t('account.basicData.surname') }}
              </label>
              <UInput
                  v-model="formData.surname"
                  :placeholder="$t('account.basicData.surnamePlaceholder')"
                  size="lg"
              />
              <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {{ $t('account.basicData.surnamePrivacy') }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ $t('account.basicData.mobilePhone') }}
              </label>
              <UInput
                  v-model="formData.phone"
                  placeholder="+7"
                  size="lg"
              />
            </div>

<!--            <div>-->
<!--              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">-->
<!--                {{ $t('account.basicData.city') }}-->
<!--              </label>-->
<!--              <USelect-->
<!--                  v-model="formData.city"-->
<!--                  :items="cityOptions"-->
<!--                  labelKey="label"-->
<!--                  valueKey="value"-->
<!--                  size="lg"-->
<!--              />-->
<!--            </div>-->
          </div>

          <!-- Правая колонка с фото -->
          <div class="flex flex-col items-center">
            <div class="relative mb-4">
              <UserAvatar
                :preview="avatarPreview"
                size="3xl"
                class="border-4 border-gray-200 dark:border-gray-700"
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
            <UButton
                variant="outline"
                color="primary"
                :loading="isUploadingAvatar"
                :disabled="isUploadingAvatar"
                @click="() => fileInput?.click()"
            >
              {{ $t('account.basicData.uploadPhoto') }}
            </UButton>
          </div>
        </div>

        <div class="flex justify-center pt-6">
          <UButton
              type="submit"
              color="primary"
              size="lg"
              :loading="isSaving"
          >
            {{ $t('account.basicData.save') }}
          </UButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const authStore = useAuthStore()
const toast = useToast()

definePageMeta({
  middleware: 'auth'
})

const cityKeys = ['minsk', 'gomel', 'vitebsk', 'grodno', 'brest', 'mogilev']
const cityOptions = computed(() =>
    cityKeys.map(key => ({
      label: t(`cities.${ key }`),
      value: key
    }))
)

const formData = ref({
  name: authStore.currentUser?.name || '',
  surname: authStore.currentUser?.surname || '',
  phone: authStore.currentUser?.phone || '+7',
  city: authStore.currentUser?.city || 'minsk'
})

const fileInput = ref<HTMLInputElement | null>(null)
const avatarPreview = ref<string | null>(null)
const isSaving = ref(false)
const isUploadingAvatar = ref(false)

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
    const api = useApi()
    const updatedUser = await api.uploadAvatar(file)
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

const handleSave = async () => {
  isSaving.value = true
  try {
    const api = useApi()
    await api.updateProfile({
      firstName: formData.value.name,
      lastName: formData.value.surname,
      phone: formData.value.phone,
    })
    await authStore.fetchProfile()
  } catch (error) {
    console.error('Ошибка при обновлении профиля:', error)
  } finally {
    isSaving.value = false
  }
}
</script>


