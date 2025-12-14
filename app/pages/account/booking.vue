<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-8">
      {{ $t('account.booking.title') }}
    </h1>

    <form @submit.prevent="handleSave" class="space-y-8">
      <ContractTemplatesSection />
      <PersonalDataSection v-model="formData.personalData" />
      <TrustedPersonSection v-model="formData.trustedPerson" />

      <div class="flex justify-center pt-6">
        <UButton
          type="submit"
          color="primary"
          size="lg"
          :loading="isSaving"
        >
          {{ $t('account.booking.save') }}
        </UButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import ContractTemplatesSection from '@/components/page/account/booking/ContractTemplatesSection.vue'
import PersonalDataSection from '@/components/page/account/booking/PersonalDataSection.vue'
import TrustedPersonSection from '@/components/page/account/booking/TrustedPersonSection.vue'

const authStore = useAuthStore()

definePageMeta({
  middleware: 'auth'
})

const formData = ref({
  personalData: {
    lastName: authStore.currentUser?.bookingData?.personalData?.lastName || '',
    firstName: authStore.currentUser?.bookingData?.personalData?.firstName || '',
    middleName: authStore.currentUser?.bookingData?.personalData?.middleName || ''
  },
  trustedPerson: {
    lastName: authStore.currentUser?.bookingData?.trustedPerson?.lastName || '',
    firstName: authStore.currentUser?.bookingData?.trustedPerson?.firstName || '',
    middleName: authStore.currentUser?.bookingData?.trustedPerson?.middleName || '',
    phone: authStore.currentUser?.bookingData?.trustedPerson?.phone || '+7'
  }
})

const isSaving = ref(false)

const handleSave = async () => {
  isSaving.value = true
  try {
    authStore.setUser({
      ...authStore.currentUser!,
      bookingData: formData.value
    })
    await new Promise(resolve => setTimeout(resolve, 500))
  } finally {
    isSaving.value = false
  }
}
</script>

