<template>
  <div class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {{ $t('account.booking.create.childrenCount') }} <span class="text-red-500">*</span>
      </label>
      <USelect
        :model-value="childrenCount"
        :items="childrenCountOptions"
        labelKey="label"
        valueKey="value"
        size="lg"
        @update:model-value="handleChildrenCountChange"
      />
    </div>

    <div v-if="childrenCount > 0" class="space-y-4">
      <div
        v-for="(age, index) in childrenAges"
        :key="index"
      >
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ $t('account.booking.create.childAge', { index: index + 1 }) }} <span class="text-red-500">*</span>
        </label>
        <UInput
          :model-value="age"
          type="number"
          min="0"
          max="18"
          :placeholder="$t('account.booking.create.agePlaceholder')"
          size="lg"
          required
          @update:model-value="(value) => handleAgeChange(index, Number(value))"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  childrenCount: number
  childrenAges: number[]
}>()

const emit = defineEmits<{
  'update:childrenCount': [value: number]
  'update:childrenAges': [value: number[]]
}>()

const childrenCountOptions = [1, 2, 3].map(count => ({
  label: count.toString(),
  value: count
}))

const handleChildrenCountChange = (count: number) => {
  emit('update:childrenCount', count)
  emit('update:childrenAges', Array(count).fill(0).map(() => 0))
}

const handleAgeChange = (index: number, age: number) => {
  const newAges = [...props.childrenAges]
  newAges[index] = age
  emit('update:childrenAges', newAges)
}
</script>

