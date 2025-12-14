<template>
  <div class="space-y-4">
    <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
      {{ $t('account.booking.trustedPerson.title') }}
    </h2>
    <p class="text-gray-600 dark:text-gray-400">
      {{ $t('account.booking.trustedPerson.description') }}
    </p>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ $t('account.booking.trustedPerson.lastName') }}
        </label>
        <UInput
          :model-value="modelValue.lastName"
          @update:model-value="(val) => emit('update:modelValue', { ...modelValue, lastName: val })"
          :placeholder="$t('account.booking.trustedPerson.lastNamePlaceholder')"
          size="lg"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ $t('account.booking.trustedPerson.firstName') }}
        </label>
        <UInput
          :model-value="modelValue.firstName"
          @update:model-value="(val) => emit('update:modelValue', { ...modelValue, firstName: val })"
          :placeholder="$t('account.booking.trustedPerson.firstNamePlaceholder')"
          size="lg"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ $t('account.booking.trustedPerson.middleName') }}
        </label>
        <UInput
          :model-value="modelValue.middleName"
          @update:model-value="(val) => emit('update:modelValue', { ...modelValue, middleName: val })"
          :placeholder="$t('account.booking.trustedPerson.middleNamePlaceholder')"
          size="lg"
        />
      </div>
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {{ $t('account.booking.trustedPerson.phone') }}
      </label>
      <UInput
        :model-value="modelValue.phone"
        @update:model-value="(val) => emit('update:modelValue', { ...modelValue, phone: val })"
        :placeholder="$t('account.booking.trustedPerson.phonePlaceholder')"
        size="lg"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: {
    lastName: string
    firstName: string
    middleName: string
    phone: string
  }
}>()

const emit = defineEmits<{
  'update:modelValue': [value: typeof props.modelValue]
}>()
</script>

