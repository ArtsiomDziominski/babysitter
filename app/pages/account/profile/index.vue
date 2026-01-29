<template>
  <div class="flex-1">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 max-xl:p-4">
      <h1 class="text-2xl max-xl:text-xl font-bold text-gray-900 dark:text-white mb-8 max-xl:mb-4">
        {{ $t('account.basicData.title') }}
      </h1>

      <form @submit.prevent="handleSave" class="space-y-6 max-xl:space-y-4">
        <div class="flex gap-8 max-xl:flex-col max-xl:gap-6">
          <!-- Левая колонка с полями -->
          <div class="flex-1 space-y-6 max-xl:space-y-4">
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
                  placeholder="+995"
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
          <PageAccountAvatarUpload />
        </div>

        <div class="flex justify-center pt-6 max-xl:pt-4">
          <UButton
              type="submit"
              color="primary"
              size="lg"
              class="max-xl:w-full"
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
import { CITY_KEYS, City } from '~/const/cities'

const { t, locale } = useI18n()
const authStore = useAuthStore()
const route = useRoute()
const siteConfig = useSiteConfig()

definePageMeta({
  middleware: 'auth'
})

const currentUrl = `${siteConfig.url}${route.path}`

useSeoMeta({
  title: () => t('account.basicData.title'),
  description: () => t('account.basicData.title'),
  ogTitle: () => t('account.basicData.title'),
  ogDescription: () => t('account.basicData.title'),
  ogImage: `${siteConfig.url}${siteConfig.logo}`,
  ogUrl: currentUrl,
  ogType: 'website',
  ogLocale: locale.value,
  twitterCard: 'summary_large_image',
  twitterTitle: () => t('account.basicData.title'),
  twitterDescription: () => t('account.basicData.title'),
  twitterImage: `${siteConfig.url}${siteConfig.logo}`,
  robots: 'noindex, nofollow'
})

useHead({
  link: [
    { rel: 'canonical', href: currentUrl }
  ]
})

const cityKeys = CITY_KEYS
const cityOptions = computed(() =>
    cityKeys.map(key => ({
      label: t(`cities.${ key }`),
      value: key
    }))
)

const formData = ref({
  name: authStore.currentUser?.name || '',
  surname: authStore.currentUser?.surname || '',
  phone: authStore.currentUser?.phone || '+995',
  city: authStore.currentUser?.city || City.TBILISI
})

const isSaving = ref(false)

const handleSave = async () => {
  isSaving.value = true
  try {
    const profile = useProfile()
    await profile.updateProfile({
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


