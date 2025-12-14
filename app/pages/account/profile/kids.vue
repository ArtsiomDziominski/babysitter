<template>
  <div class="flex-1">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ $t('account.children.title') }}
        </h1>
        <UButton
            variant="outline"
            color="primary"
            @click="addChild"
        >
          {{ $t('account.children.addChild') }}
        </UButton>
      </div>

      <div v-if="children.length === 0" class="text-center py-12 text-gray-500 dark:text-gray-400">
        <p class="text-lg mb-4">{{ $t('account.children.noChildren') }}</p>
        <UButton
            color="primary"
            @click="addChild"
        >
          {{ $t('account.children.addChild') }}
        </UButton>
      </div>

      <div v-else class="space-y-6">
        <div
            v-for="(child, index) in children"
            :key="index"
            class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 space-y-4"
        >
          <div class="flex items-start justify-between">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Ребенок {{ index + 1 }}
            </h3>
            <UButton
                variant="ghost"
                color="red"
                size="sm"
                @click="removeChild(index)"
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
                  v-model="child.name"
                  :placeholder="$t('account.children.namePlaceholder')"
                  size="lg"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ $t('account.children.age') }}
              </label>
              <UInput
                  v-model="child.age"
                  :placeholder="$t('account.children.agePlaceholder')"
                  type="number"
                  size="lg"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ $t('account.children.gender') }}
              </label>
              <USelect
                  v-model="child.gender"
                  :items="genderOptions"
                  labelKey="label"
                  valueKey="value"
                  size="lg"
              />
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ $t('account.children.notes') }}
              </label>
              <textarea
                  v-model="child.notes"
                  :placeholder="$t('account.children.notesPlaceholder')"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div v-if="children.length > 0"
           class="flex justify-center pt-6 mt-8 border-t border-gray-200 dark:border-gray-700">
        <UButton
            color="primary"
            size="lg"
            :loading="isSaving"
            @click="handleSave"
        >
          {{ $t('account.basicData.save') }}
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const authStore = useAuthStore()

definePageMeta({
  middleware: 'auth'
})

const children = ref<Array<{
  name: string
  age: string
  gender: string
  notes: string
}>>(JSON.parse(JSON.stringify(authStore.currentUser?.children || [])))

const genderOptions = computed(() => [
  { label: t('account.children.genderMale'), value: 'male' },
  { label: t('account.children.genderFemale'), value: 'female' }
])

const isSaving = ref(false)

const addChild = () => {
  children.value.push({
    name: '',
    age: '',
    gender: 'male',
    notes: ''
  })
}

const removeChild = (index: number) => {
  children.value.splice(index, 1)
}

const handleSave = async () => {
  isSaving.value = true
  try {
    authStore.setUser({
      ...authStore.currentUser!,
      children: children.value
    })
    await new Promise(resolve => setTimeout(resolve, 500))
  } finally {
    isSaving.value = false
  }
}
</script>


