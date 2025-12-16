<template>
  <UModal v-model:open="isOpen" :title="state.title || ''">
    <template #body>
      <p v-if="state.description" class="text-gray-700 dark:text-gray-300">
        {{ state.description }}
      </p>
    </template>

    <template #footer>
      <div class="flex justify-end gap-3">
        <UButton
            v-for="(action, index) in state.actions"
            :key="index"
            :color="action.color || 'neutral'"
            :variant="action.variant || 'outline'"
            :loading="action.loading"
            :disabled="action.disabled"
            @click="handleAction(action)"
        >
          {{ action.label }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

const modalStore = useModalStore()
const { state } = storeToRefs(modalStore)

const isOpen = computed({
  get: () => state.value.isOpen,
  set: (value) => {
    if (!value) {
      modalStore.close()
    }
  }
})

const handleAction = async (action: typeof state.value.actions[0]) => {
  try {
    await action.handler()
  } catch (error) {
    console.error('Ошибка при выполнении действия:', error)
  }
}
</script>

