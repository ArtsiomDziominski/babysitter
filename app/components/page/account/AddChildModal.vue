<template>
  <UModal v-model:open="isOpen" :title="isEdit ? $t('account.children.editChild') : $t('account.children.addChild')">
    <template #body>
      <div v-if="child">
        <PageAccountChildForm
            :child="child"
            :index="0"
            :is-new="!isEdit"
            :hide-header="true"
            @update:child="$emit('update:child', $event)"
        />
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-3">
        <UButton
            variant="outline"
            @click="handleClose"
        >
          {{ $t('account.security.cancel') }}
        </UButton>
        <UButton
            color="primary"
            :loading="isSaving"
            :disabled="!child?.name?.trim()"
            @click="$emit('save')"
        >
          {{ $t('account.basicData.save') }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { Child } from '~/composables/useChildren'

interface Props {
  modelValue: boolean
  child: Child | null
  isSaving?: boolean
  isEdit?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isSaving: false,
  isEdit: false
})

const isEdit = computed(() => props.isEdit && props.child?.id !== undefined)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'update:child': [child: Child]
  'save': []
  'close': []
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const handleClose = () => {
  emit('close')
  isOpen.value = false
}
</script>

