<template>
  <div>
    <div class="py-6 md:py-8">
      <div class="mb-6">
        <UBreadcrumb :items="breadcrumbItems" />
      </div>

      <div v-if="sitter" class="space-y-8">
        <SitterHeader
          :sitter="sitter"
          :is-favorite="isFavorite"
          @toggle-favorite="toggleFavorite"
          @contact="handleContact"
          @message="handleMessage"
        />

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-24 lg:pb-8">
          <div class="lg:col-span-2 space-y-8">
            <SitterAboutSection :sitter="sitter" />

            <SitterScheduleSection :sitter="sitter" />

            <SitterWorkInfoSection :sitter="sitter" />
          </div>

          <div class="lg:col-span-1">
            <div class="sticky -top-4">
              <SitterReviewsSection :sitter="sitter" />
            </div>
          </div>
        </div>

        <div class="lg:hidden fixed bottom-0 left-0 right-0 bg-default/90 backdrop-blur border-t border-default p-4 z-50">
          <div class="max-w-7xl mx-auto flex gap-3">
            <div v-if="isBabysitter" class="flex-1 p-3 bg-muted rounded-lg border border-default flex items-center justify-center">
              <p class="text-xs text-toned text-center">
                {{ $t('bookings.sitter.actions.babysitterCannotBook') }}
              </p>
            </div>
            <UButton
              v-else
              color="primary"
              size="lg"
              icon="i-lucide-calendar-plus"
              block
              class="flex-1 font-semibold"
              @click="handleContact"
            >
              {{ $t('bookings.sitter.actions.book') }}
            </UButton>
            <UButton
              v-if="!isBabysitter"
              variant="outline"
              size="lg"
              icon="i-lucide-message-circle"
              block
              class="flex-1 font-semibold"
              @click="handleMessage"
            >
              {{ $t('bookings.sitter.actions.message') }}
            </UButton>
          </div>
        </div>
      </div>

      <div v-else-if="pending" class="flex items-center justify-center min-h-[60vh]">
        <div class="text-center">
          <UIcon name="i-lucide-loader-circle" class="size-10 animate-spin text-primary mx-auto mb-4" />
          <p class="text-muted">
            Загрузка...
          </p>
        </div>
      </div>
      <div v-else-if="error" class="flex items-center justify-center min-h-[60vh]">
        <div class="text-center">
          <Icon name="i-lucide-alert-circle" size="48" class="text-error-500 mx-auto mb-4" />
          <p class="text-error-500 dark:text-error-400 text-lg">
            Ошибка загрузки данных
          </p>
        </div>
      </div>
      <div v-else class="flex items-center justify-center min-h-[60vh]">
        <div class="text-center">
          <Icon name="i-lucide-user-x" size="48" class="text-dimmed mx-auto mb-4" />
          <p class="text-muted text-lg">
            Ситтер не найден
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Sitter } from '~/types/sitter'
import { useBabysitter, mapBabysitterToSitter } from '~/composables/useBabysitter'
import { UserRole } from '~/const/roles'

const route = useRoute()
const bookId = route.params.id as string
const babysitterApi = useBabysitter()
const authStore = useAuthStore()
const { t, locale } = useI18n()
const localePath = useLocalePath()
const siteConfig = useSiteConfig()

const currentUrl = `${siteConfig.url}${route.path}`

const isFavorite = ref(false)
const isBabysitter = computed(() => authStore.currentUser?.role === UserRole.BABYSITTER)

const { data: sitter, pending, error } = await useAsyncData<Sitter | null>(
  `sitter-${bookId}`,
  async () => {
    try {
      const id = parseInt(bookId)
      if (isNaN(id)) {
        return null
      }
      const babysitterData = await babysitterApi.fetchBabysitterById(id)
      if (!babysitterData) {
        return null
      }
      return mapBabysitterToSitter(babysitterData)
    } catch (err: any) {
      if (err?.statusCode === 404) {
        return null
      }
      console.error('Ошибка загрузки ситтера:', err)
      throw err
    }
  }
)

// Несуществующая анкета должна отдавать 404, а не страницу с кодом 200
if (!sitter.value && !error.value) {
  throw createError({ statusCode: 404, statusMessage: 'Sitter not found' })
}

const seoTitle = computed(() => {
  if (sitter.value) {
    return t('seo.sitter.title', { name: sitter.value.name })
  }
  return t('seo.sitter.defaultTitle')
})

const seoDescription = computed(() => {
  if (sitter.value) {
    return sitter.value.description
      ? `${sitter.value.description.substring(0, 160)}...`
      : t('seo.sitter.description', { name: sitter.value.name })
  }
  return t('seo.sitter.defaultDescription')
})

const seoImage = computed(() => {
  return sitter.value?.avatar || `${siteConfig.url}${siteConfig.logo}`
})

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogImage: seoImage,
  ogUrl: currentUrl,
  ogType: () => sitter.value ? 'profile' : 'website',
  ogLocale: locale.value,
  twitterCard: 'summary_large_image',
  twitterTitle: seoTitle,
  twitterDescription: seoDescription,
  twitterImage: seoImage
})

useHead({
  link: [
    { rel: 'canonical', href: currentUrl }
  ]
})

const breadcrumbItems = computed(() => [
  {
    label: 'Главная',
    icon: 'i-lucide-home',
    to: localePath('/')
  },
  {
    label: 'Поиск',
    icon: 'i-lucide-search',
    to: localePath('/search')
  },
  {
    label: sitter.value?.name || 'Ситтер',
    icon: 'i-lucide-user'
  }
])

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
}

const handleContact = () => {
  const router = useRouter()
  router.push(localePath(`/sitter/${bookId}/book`))
}

const handleMessage = () => {
  if (sitter.value?.userId) useRouter().push(`/account/messages?chat=null&userId=${sitter.value.userId}`)
}

</script>
