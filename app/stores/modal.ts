import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface ModalAction {
  label: string
  color?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'
  variant?: 'solid' | 'outline' | 'ghost' | 'soft' | 'subtle'
  loading?: boolean
  disabled?: boolean
  handler: () => void | Promise<void>
}

export interface ModalState {
  isOpen: boolean
  title: string
  description?: string
  actions: ModalAction[]
}

export const useModalStore = defineStore('modal', () => {
  const state = ref<ModalState>({
    isOpen: false,
    title: '',
    description: undefined,
    actions: []
  })

  const open = (config: Omit<ModalState, 'isOpen'>) => {
    state.value = {
      isOpen: true,
      title: config.title,
      description: config.description,
      actions: config.actions
    }
  }

  const close = () => {
    state.value.isOpen = false
  }

  const updateAction = (index: number, updates: Partial<ModalAction>) => {
    if (state.value.actions[index]) {
      state.value.actions[index] = {
        ...state.value.actions[index],
        ...updates
      }
    }
  }

  return {
    state,
    open,
    close,
    updateAction
  }
})

