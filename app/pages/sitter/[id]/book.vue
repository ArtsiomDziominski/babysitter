<template>
  <div class="max-w-4xl mx-auto py-6 md:py-8">
    <div class="mb-6">
      <UBreadcrumb :items="breadcrumbItems" />
    </div>

    <div v-if="sitter && !isLoading" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 md:p-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {{ $t('account.booking.create.title') }}
      </h1>
      <p class="text-gray-500 dark:text-gray-400 mb-6">
        {{ $t('account.booking.create.subtitle', { name: sitter.name }) }}
      </p>

      <BookingTypeSelector v-model="bookingType" />

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <BookingDateTimeFields
          v-model:start-date="form.startDate"
          v-model:start-time="form.startTime"
          v-model:end-date="form.endDate"
          v-model:end-time="form.endTime"
          :schedule="sitter?.schedule"
        />

        <BookingChildrenFields
          v-model:selected-children="form.selectedChildren"
        />

        <BookingTrustedContactFields
          v-model:selected-trusted-contact="form.selectedTrustedContact"
        />

        <BookingSpecialConditions
          :booking-type="bookingType"
          v-model:child-is-sick="form.childIsSick"
          v-model:has-special-needs-child="form.hasSpecialNeedsChild"
          v-model:needs-help-with-homework="form.needsHelpWithHomework"
          v-model:needs-outdoor-activities="form.needsOutdoorActivities"
          v-model:needs-car-transportation="form.needsCarTransportation"
          v-model:needs-walking="form.needsWalking"
        />

        <BookingNotesField v-model="form.notes" />

        <BookingPriceDisplay :price="calculatedPrice" />

        <div class="flex gap-3 pt-4">
          <UButton
            variant="outline"
            :disabled="isSubmitting"
            @click="handleCancel"
          >
            {{ $t('account.booking.create.cancel') }}
          </UButton>
          <UButton
            type="submit"
            color="primary"
            :loading="isSubmitting"
            :disabled="!isFormValid"
          >
            {{ $t('account.booking.create.submit') }}
          </UButton>
        </div>
      </form>
    </div>

    <div v-else-if="isLoading" class="flex items-center justify-center py-24">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
        <p class="text-gray-500 dark:text-gray-400">
          {{ $t('account.booking.create.loading') }}
        </p>
      </div>
    </div>

    <div v-else class="flex items-center justify-center py-24">
      <div class="text-center">
        <Icon name="i-lucide-alert-circle" size="48" class="text-red-500 mx-auto mb-4" />
        <p class="text-red-500 dark:text-red-400 text-lg mb-4">
          {{ sitterError ? $t('account.booking.create.loadError') : $t('account.booking.create.notFound') }}
        </p>
        <UButton
          variant="outline"
          @click="router.push('/search')"
        >
          {{ $t('account.booking.create.backToSearch') }}
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Sitter } from '~/types/sitter'
import type { BookingChild } from '~/composables/useBookings'
import type { TrustedContact } from '~/composables/useTrustedContacts'
import { useBabysitter, mapBabysitterToSitter } from '~/composables/useBabysitter'
import { useBookings } from '~/composables/useBookings'
import { useBookingPrice } from '~/composables/useBookingPrice'

const route = useRoute()
const router = useRouter()
const sitterId = route.params.id as string
const babysitterApi = useBabysitter()
const bookingsApi = useBookings()
const { calculatePrice } = useBookingPrice()
const toast = useToast()

definePageMeta({
  middleware: ['auth', 'parent-only']
})

const isLoading = ref(true)
const isSubmitting = ref(false)
const bookingType = ref<'offline' | 'online'>('offline')

const form = ref({
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
  selectedChildren: [] as BookingChild[],
  selectedTrustedContact: null as TrustedContact | null,
  childIsSick: false,
  hasSpecialNeedsChild: false,
  needsHelpWithHomework: false,
  needsOutdoorActivities: false,
  needsCarTransportation: false,
  needsWalking: false,
  notes: '',
})

watch(bookingType, () => {
  if (bookingType.value === 'online') {
    form.value.needsOutdoorActivities = false
    form.value.needsCarTransportation = false
    form.value.needsWalking = false
    form.value.childIsSick = false
    form.value.hasSpecialNeedsChild = false
  }
})

const { data: sitter, pending, error: sitterError } = await useAsyncData<Sitter | null>(
  `sitter-${sitterId}-book`,
  async () => {
    try {
      const id = parseInt(sitterId)
      if (isNaN(id)) {
        return null
      }
      const babysitterData = await babysitterApi.fetchBabysitterById(id)
      if (!babysitterData) {
        return null
      }
      return mapBabysitterToSitter(babysitterData)
    } catch (err) {
      console.error('Ошибка загрузки ситтера:', err)
      return null
    }
  }
)

watch(pending, (val) => {
  isLoading.value = val
}, { immediate: true })

const calculatedPrice = computed(() => {
  const childrenCount = form.value.selectedChildren.filter(child => child.age > 0).length || 1
  return calculatePrice(
    sitter.value ?? null,
    bookingType.value,
    childrenCount,
    form.value.startDate,
    form.value.startTime,
    form.value.endDate,
    form.value.endTime
  )
})

const isFormValid = computed(() => {
  const validChildren = form.value.selectedChildren.filter(child => child.age > 0 && child.age <= 18)
  return (
    form.value.startDate &&
    form.value.startTime &&
    form.value.endDate &&
    form.value.endTime &&
    validChildren.length > 0
  )
})

const { t } = useI18n()

const breadcrumbItems = computed(() => [
  {
    label: t('common.home'),
    icon: 'i-lucide-home',
    to: '/'
  },
  {
    label: t('common.search'),
    icon: 'i-lucide-search',
    to: '/search'
  },
  {
    label: sitter.value?.name || t('common.sitter'),
    icon: 'i-lucide-user',
    to: `/sitter/${sitterId}`
  },
  {
    label: t('common.booking'),
    icon: 'i-lucide-calendar'
  }
])

const handleCancel = () => {
  router.push(`/sitter/${sitterId}`)
}

const handleSubmit = async () => {
  if (!isFormValid.value || !sitter.value) {
    return
  }

  isSubmitting.value = true

  try {
    const startDateTime = new Date(`${form.value.startDate}T${form.value.startTime}`)
    const endDateTime = new Date(`${form.value.endDate}T${form.value.endTime}`)

    if (endDateTime <= startDateTime) {
      toast.add({
        title: t('account.booking.create.error.title'),
        description: t('account.booking.create.validation.endTimeBeforeStart'),
        color: 'error'
      })
      return
    }

    const specialConditions: string[] = []
    if (bookingType.value === 'offline') {
      if (form.value.childIsSick) {
        specialConditions.push(t('account.booking.create.specialConditions.childIsSick'))
      }
      if (form.value.hasSpecialNeedsChild) {
        specialConditions.push(t('account.booking.create.specialConditions.hasSpecialNeedsChild'))
      }
      if (form.value.needsHelpWithHomework) {
        specialConditions.push(t('account.booking.create.specialConditions.needsHelpWithHomework'))
      }
      if (form.value.needsOutdoorActivities) {
        specialConditions.push(t('account.booking.create.specialConditions.needsOutdoorActivities'))
      }
      if (form.value.needsCarTransportation) {
        specialConditions.push(t('account.booking.create.specialConditions.needsCarTransportation'))
      }
      if (form.value.needsWalking) {
        specialConditions.push(t('account.booking.create.specialConditions.needsWalking'))
      }
    } else {
      if (form.value.needsHelpWithHomework) {
        specialConditions.push(t('account.booking.create.specialConditions.needsHelpWithHomework'))
      }
    }

    let notes = form.value.notes || ''
    if (specialConditions.length > 0) {
      const conditionsText = specialConditions.join(', ')
      notes = notes ? `${conditionsText}. ${notes}` : conditionsText
    }

    const babysitterIdNum = parseInt(sitterId)
    if (isNaN(babysitterIdNum)) {
      throw new Error('Неверный ID няни')
    }

    const validChildren = form.value.selectedChildren.filter(child => child.age > 0 && child.age <= 18)
    if (validChildren.length === 0) {
      throw new Error('Необходимо указать хотя бы одного ребенка с корректным возрастом')
    }

    const bookingData: any = {
      babysitterId: babysitterIdNum,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      children: validChildren.map(child => ({
        name: child.name || '',
        age: child.age,
        ...(child.description ? { description: child.description } : {})
      })),
      bookingType: bookingType.value,
    }

    if (bookingType.value === 'offline') {
      bookingData.childIsSick = form.value.childIsSick
      bookingData.hasSpecialNeedsChild = form.value.hasSpecialNeedsChild
      bookingData.needsOutdoorActivities = form.value.needsOutdoorActivities
      bookingData.needsCarTransportation = form.value.needsCarTransportation
      bookingData.needsWalking = form.value.needsWalking
    }

    bookingData.needsHelpWithHomework = form.value.needsHelpWithHomework

    if (notes) {
      bookingData.notes = notes
    }

    if (form.value.selectedTrustedContact) {
      bookingData.trustedContacts = [{
        firstName: form.value.selectedTrustedContact.firstName,
        lastName: form.value.selectedTrustedContact.lastName,
        phone: form.value.selectedTrustedContact.phone,
        relationship: form.value.selectedTrustedContact.relationship || null
      }]
    }

    await bookingsApi.createBooking(bookingData)

    toast.add({
      title: t('account.booking.create.success.title'),
      description: t('account.booking.create.success.message'),
      color: 'success'
    })

    router.push('/account/orders')
  } catch (error: any) {
    console.error('Ошибка создания бронирования:', error)
    toast.add({
      title: t('account.booking.create.error.title'),
      description: error.message || t('account.booking.create.error.message'),
      color: 'error'
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>

