<template>
  <div :class="hideHeader ? 'space-y-4' : 'bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 space-y-4'">
    <div v-if="!hideHeader" class="flex items-start justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
        {{ $t('account.children.childNumber', { number: index + 1 }) }}
      </h3>
      <UButton
          variant="ghost"
          color="red"
          size="sm"
          @click="$emit('remove')"
      >
        {{ $t('account.children.removeChild') }}
      </UButton>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ $t('account.children.name') }}
        </label>
        <UInput
            :model-value="localChild.name"
            :placeholder="$t('account.children.namePlaceholder')"
            size="lg"
            required
            @update:model-value="updateField('name', $event)"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ $t('account.children.age') }}
        </label>
        <UInput
            :model-value="localChild.age ?? ''"
            :placeholder="$t('account.children.agePlaceholder')"
            type="number"
            min="0"
            max="18"
            size="lg"
            @update:model-value="updateField('age', $event && $event !== '' ? Number($event) : null)"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ $t('account.children.gender') }}
        </label>
        <USelect
            :model-value="localChild.gender"
            :items="genderOptions"
            labelKey="label"
            valueKey="value"
            size="lg"
            @update:model-value="updateField('gender', $event)"
        />
      </div>

      <div class="md:col-span-2">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ $t('account.children.allergies') }}
        </label>
        <textarea
            :value="localChild.allergies || ''"
            :placeholder="$t('account.children.allergiesPlaceholder')"
            rows="2"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            @input="updateField('allergies', ($event.target as HTMLTextAreaElement).value || null)"
        />
      </div>

      <div class="md:col-span-2">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ $t('account.children.specialNeeds') }}
        </label>
        <textarea
            :value="localChild.specialNeeds || ''"
            :placeholder="$t('account.children.specialNeedsPlaceholder')"
            rows="2"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            @input="updateField('specialNeeds', ($event.target as HTMLTextAreaElement).value || null)"
        />
      </div>

      <div class="md:col-span-2">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ $t('account.children.notes') }}
        </label>
        <textarea
            :value="localChild.notes || ''"
            :placeholder="$t('account.children.notesPlaceholder')"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            @input="updateField('notes', ($event.target as HTMLTextAreaElement).value || null)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Child } from '~/composables/useChildren'

interface Props {
  child: Child
  index: number
  isNew?: boolean
  hideHeader?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isNew: false,
  hideHeader: false
})

const emit = defineEmits<{
  'update:child': [child: Child]
  'remove': []
}>()

const { t } = useI18n()

const localChild = computed(() => props.child)

const updateField = (field: keyof Child, value: any) => {
  emit('update:child', {
    ...localChild.value,
    [field]: value
  })
}

const genderOptions = computed(() => [
  { label: t('account.children.genderMale'), value: 'male' },
  { label: t('account.children.genderFemale'), value: 'female' }
])
</script>

