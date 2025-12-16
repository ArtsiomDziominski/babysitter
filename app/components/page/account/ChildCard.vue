<template>
  <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
    <div class="flex items-start justify-between mb-4">
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {{ child.name }}
        </h3>
        <div class="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
          <span v-if="child.age !== null && child.age !== undefined">
            {{ $t('account.children.age') }}: {{ child.age }}
          </span>
          <span v-if="child.gender">
            {{ $t('account.children.gender') }}: {{ genderLabel }}
          </span>
        </div>
      </div>
      <div class="flex gap-2">
        <UButton
            variant="ghost"
            color="primary"
            size="sm"
            :disabled="isDeleting"
            @click="$emit('edit')"
        >
          {{ $t('account.children.editChild') }}
        </UButton>
        <UButton
            variant="ghost"
            color="red"
            size="sm"
            :loading="isDeleting"
            :disabled="isDeleting"
            @click="$emit('remove')"
        >
          {{ $t('account.children.removeChild') }}
        </UButton>
      </div>
    </div>

    <div v-if="child.allergies || child.specialNeeds || child.notes" class="space-y-2 text-sm">
      <div v-if="child.allergies" class="text-gray-700 dark:text-gray-300">
        <span class="font-medium">{{ $t('account.children.allergies') }}: </span>
        <span>{{ child.allergies }}</span>
      </div>
      <div v-if="child.specialNeeds" class="text-gray-700 dark:text-gray-300">
        <span class="font-medium">{{ $t('account.children.specialNeeds') }}: </span>
        <span>{{ child.specialNeeds }}</span>
      </div>
      <div v-if="child.notes" class="text-gray-700 dark:text-gray-300">
        <span class="font-medium">{{ $t('account.children.notes') }}: </span>
        <span>{{ child.notes }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Child } from '~/composables/useChildren'

interface Props {
  child: Child
  isDeleting?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isDeleting: false
})

const emit = defineEmits<{
  'remove': []
  'edit': []
}>()

const { t } = useI18n()

const genderLabel = computed(() => {
  if (props.child.gender === 'male') {
    return t('account.children.genderMale')
  } else if (props.child.gender === 'female') {
    return t('account.children.genderFemale')
  }
  return props.child.gender || ''
})
</script>

