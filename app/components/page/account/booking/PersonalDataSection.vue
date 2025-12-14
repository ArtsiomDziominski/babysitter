<template>
  <div class="space-y-4">
    <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
      {{ $t('account.booking.personalData.title') }}
    </h2>
    <p class="text-gray-600 dark:text-gray-400">
      {{ $t('account.booking.personalData.description') }}
    </p>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ $t('account.booking.personalData.lastName') }}
        </label>
        <UInput
          :model-value="modelValue.lastName"
          @update:model-value="(val) => emit('update:modelValue', { ...modelValue, lastName: val })"
          :placeholder="$t('account.booking.personalData.lastNamePlaceholder')"
          size="lg"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ $t('account.booking.personalData.firstName') }}
        </label>
        <UInput
          :model-value="modelValue.firstName"
          @update:model-value="(val) => emit('update:modelValue', { ...modelValue, firstName: val })"
          :placeholder="$t('account.booking.personalData.firstNamePlaceholder')"
          size="lg"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ $t('account.booking.personalData.middleName') }}
        </label>
        <UInput
          :model-value="modelValue.middleName"
          @update:model-value="(val) => emit('update:modelValue', { ...modelValue, middleName: val })"
          :placeholder="$t('account.booking.personalData.middleNamePlaceholder')"
          size="lg"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: {
    lastName: string
    firstName: string
    middleName: string
  }
}>()

const emit = defineEmits<{
  'update:modelValue': [value: typeof props.modelValue]
}>()
</script>

