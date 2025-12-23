<template>
  <div class="space-y-4">
    <div class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4">
      <div class="flex items-center justify-between">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {{ $t('account.booking.create.selectedChildren') }}
        </label>
        <UButton
          v-if="selectedChildren.length < 5"
          variant="outline"
          color="primary"
          size="sm"
          @click="addNewChildForm"
        >
          <Icon name="i-lucide-plus" size="16" class="mr-2" />
          {{ $t('account.booking.create.addChild') }}
        </UButton>
      </div>

      <div v-if="newChildrenForms.length > 0" class="space-y-3">
        <div
          v-for="(form, index) in newChildrenForms"
          :key="form.id"
          class="flex items-center gap-2"
        >
          <UInput
            v-model="form.name"
            :placeholder="$t('account.children.namePlaceholder')"
            size="lg"
            class="flex-1"
            maxlength="100"
          />
          <UInput
            v-model="form.age"
            type="number"
            step="0.1"
            min="0.1"
            max="18"
            :placeholder="$t('account.booking.create.agePlaceholder')"
            size="lg"
            class="w-32"
            maxlength="3"
            required
          />
          <UButton
            color="primary"
            size="lg"
            :disabled="!form.name || !form.age || form.age <= 0"
            @click="addChildFromForm(form.id)"
          >
            {{ $t('account.booking.create.addChild') }}
          </UButton>
          <UButton
            variant="ghost"
            color="error"
            size="lg"
            @click="removeNewChildForm(form.id)"
          >
            <Icon name="i-lucide-x" size="16" />
          </UButton>
        </div>
      </div>

      <div v-if="selectedChildren.length > 0" class="space-y-2">
        <div
          v-for="(child, index) in selectedChildren"
          :key="index"
          class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
        >
          <div>
            <span class="font-medium">{{ child.name || $t('account.booking.create.childAge', { index: index + 1 }) }}</span>
            <span v-if="child.age" class="text-gray-500 ml-2">
              ({{ child.age }} {{ $t('account.orders.details.years') }})
            </span>
          </div>
          <UButton
            variant="ghost"
            color="error"
            size="sm"
            @click="removeChild(index)"
          >
            <Icon name="i-lucide-x" size="16" />
          </UButton>
        </div>
      </div>

      <div v-else class="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
        {{ $t('account.booking.create.noChildrenSelected') }}
      </div>

      <div v-if="profileChildren.length > 0 && availableProfileChildren.length > 0" class="pt-4 border-t border-gray-200 dark:border-gray-700">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          {{ $t('account.booking.create.selectChildrenFromProfile') }}
        </label>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <UButton
            v-for="child in availableProfileChildren"
            :key="child.id"
            variant="outline"
            color="primary"
            class="justify-start"
            @click="addChildFromProfile(child)"
          >
            <div class="flex items-center gap-2">
              <Icon name="i-lucide-plus" size="16" />
              <span>{{ child.name }}</span>
              <span v-if="child.age !== null && child.age !== undefined" class="text-gray-500">
                ({{ child.age }} {{ $t('account.orders.details.years') }})
              </span>
            </div>
          </UButton>
        </div>
      </div>

      <div v-if="profileChildren.length === 0" class="pt-4 border-t border-gray-200 dark:border-gray-700">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ $t('account.booking.create.noChildrenInProfile') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Child } from '~/composables/useChildren'
import type { BookingChild } from '~/composables/useBookings'

const props = defineProps<{
  selectedChildren: BookingChild[]
}>()

const emit = defineEmits<{
  'update:selectedChildren': [value: BookingChild[]]
}>()

const authStore = useAuthStore()
const { getChildren } = useChildren()

const profileChildren = ref<Child[]>([])
const isLoading = ref(false)

interface NewChildForm {
  id: number
  name: string
  age: number
}

const newChildrenForms = ref<NewChildForm[]>([])
let formIdCounter = 0

const selectedChildren = computed({
  get: () => props.selectedChildren,
  set: (value) => emit('update:selectedChildren', value)
})

const MAX_CHILDREN = 5

const availableProfileChildren = computed(() => {
  if (selectedChildren.value.length >= MAX_CHILDREN) {
    return []
  }
  return profileChildren.value.filter(child => {
    if (child.age === null || child.age === undefined) return false
    const isSelected = selectedChildren.value.some(
      selected => selected.name === child.name && selected.age === child.age
    )
    return !isSelected
  })
})

const loadProfileChildren = async () => {
  if (authStore.currentUser?.children && authStore.currentUser.children.length > 0) {
    profileChildren.value = authStore.currentUser.children.map((child: any) => ({
      ...child,
      age: child.age !== undefined && child.age !== null ? Number(child.age) : null,
    }))
    autoAddSingleChild()
    return
  }

  isLoading.value = true
  try {
    const response = await getChildren()
    const mappedChildren = response.data.map((child: any) => ({
      ...child,
      age: child.age !== undefined && child.age !== null ? Number(child.age) : null,
    }))
    profileChildren.value = mappedChildren
    authStore.setChildren(mappedChildren)
    autoAddSingleChild()
  } catch (error) {
    console.error('Ошибка загрузки детей:', error)
    profileChildren.value = []
  } finally {
    isLoading.value = false
  }
}

const autoAddSingleChild = () => {
  if (profileChildren.value.length === 1) {
    const child = profileChildren.value[0]
    if (child && child.age !== null && child.age !== undefined) {
      const isAlreadyAdded = props.selectedChildren.some(
        selected => selected.name === child.name && selected.age === child.age
      )
      if (!isAlreadyAdded) {
        addChildFromProfile(child)
      }
    }
  }
}

const addChildFromProfile = (child: Child) => {
  if (child.age === null || child.age === undefined) {
    return
  }

  const currentChildren = props.selectedChildren
  if (currentChildren.length >= MAX_CHILDREN) {
    return
  }

  const descriptionParts: string[] = []
  if (child.allergies) descriptionParts.push(`Аллергии: ${child.allergies}`)
  if (child.specialNeeds) descriptionParts.push(`Особые потребности: ${child.specialNeeds}`)
  if (child.notes) descriptionParts.push(child.notes)

  const newChild: BookingChild = {
    name: child.name,
    age: child.age,
    description: descriptionParts.length > 0 ? descriptionParts.join('. ') : undefined
  }

  const updated = [...currentChildren, newChild]
  emit('update:selectedChildren', updated)
}

const removeChild = (index: number) => {
  const newChildren = [...props.selectedChildren]
  newChildren.splice(index, 1)
  emit('update:selectedChildren', newChildren)
}

const addNewChildForm = () => {
  if (props.selectedChildren.length >= MAX_CHILDREN) {
    return
  }
  formIdCounter++
  newChildrenForms.value.push({
    id: formIdCounter,
    name: '',
    age: 0
  })
}

const removeNewChildForm = (id: number) => {
  const formIndex = newChildrenForms.value.findIndex(f => f.id === id)
  if (formIndex !== -1) {
    newChildrenForms.value.splice(formIndex, 1)
  }
}

const addChildFromForm = (id: number) => {
  const currentChildren = props.selectedChildren
  if (currentChildren.length >= MAX_CHILDREN) {
    return
  }
  
  const form = newChildrenForms.value.find(f => f.id === id)
  if (form && form.name && form.age > 0) {
    const newChild: BookingChild = {
      name: form.name,
      age: form.age,
      description: undefined
    }
    
    const updated = [newChild, ...currentChildren]
    emit('update:selectedChildren', updated)
    removeNewChildForm(id)
  }
}

onMounted(() => {
  loadProfileChildren()
})
</script>