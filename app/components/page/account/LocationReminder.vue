<template>
  <UAlert
      v-if="isBabysitter && isVisible && !isEditingLocation"
      icon="i-lucide-map-pin"
      :ui="{ icon: 'text-primary' }"
      color="neutral"
      variant="outline"
      :title="t('account.locationReminder.title')"
      :description="t('account.locationReminder.description')"
      :actions="[{
        label: t('account.locationReminder.action'),
        color: 'primary',
        variant: 'solid',
        onClick: openForm,
      }]"
      close
      @update:open="dismiss"
  />
</template>

<script setup lang="ts">
import { UserRole } from '~/const/roles'

const { t } = useI18n()
const authStore = useAuthStore()
const localePath = useLocalePath()
const { isVisible, check, dismiss } = useSitterLocationReminder()

const route = useRoute()
const isBabysitter = computed(() => authStore.user?.role === UserRole.BABYSITTER)
// Няня уже в форме у карты — баннер там лишний
const isEditingLocation = computed(() => route.query.edit === 'location')

const openForm = () => {
  navigateTo(localePath({ path: '/account/booking/babysitter', query: { edit: 'location' } }))
}

onMounted(() => {
  if (isBabysitter.value) check()
})
</script>
