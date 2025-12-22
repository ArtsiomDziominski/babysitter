<template>
  <div class="space-y-3">
    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      {{ $t('account.booking.create.specialConditions.title') }}
    </label>
    <div class="space-y-2">
      <template v-if="bookingType === 'offline'">
        <label class="flex items-center gap-3 cursor-pointer">
          <UCheckbox :model-value="childIsSick" @update:model-value="$emit('update:childIsSick', $event)" />
          <span class="text-sm text-gray-700 dark:text-gray-300">
            {{ $t('account.booking.create.specialConditions.childIsSick') }}
          </span>
        </label>
        <label class="flex items-center gap-3 cursor-pointer">
          <UCheckbox :model-value="hasSpecialNeedsChild" @update:model-value="$emit('update:hasSpecialNeedsChild', $event)" />
          <span class="text-sm text-gray-700 dark:text-gray-300">
            {{ $t('account.booking.create.specialConditions.hasSpecialNeedsChild') }}
          </span>
        </label>
        <label class="flex items-center gap-3 cursor-pointer">
          <UCheckbox :model-value="needsHelpWithHomework" @update:model-value="$emit('update:needsHelpWithHomework', $event)" />
          <span class="text-sm text-gray-700 dark:text-gray-300">
            {{ $t('account.booking.create.specialConditions.needsHelpWithHomework') }}
          </span>
        </label>
        <label class="flex items-center gap-3 cursor-pointer">
          <UCheckbox :model-value="needsOutdoorActivities" @update:model-value="$emit('update:needsOutdoorActivities', $event)" />
          <span class="text-sm text-gray-700 dark:text-gray-300">
            {{ $t('account.booking.create.specialConditions.needsOutdoorActivities') }}
          </span>
        </label>
        <label class="flex items-center gap-3 cursor-pointer">
          <UCheckbox :model-value="needsCarTransportation" @update:model-value="$emit('update:needsCarTransportation', $event)" />
          <span class="text-sm text-gray-700 dark:text-gray-300">
            {{ $t('account.booking.create.specialConditions.needsCarTransportation') }}
          </span>
        </label>
        <label class="flex items-center gap-3 cursor-pointer">
          <UCheckbox :model-value="needsWalking" @update:model-value="$emit('update:needsWalking', $event)" />
          <span class="text-sm text-gray-700 dark:text-gray-300">
            {{ $t('account.booking.create.specialConditions.needsWalking') }}
          </span>
        </label>
      </template>
      <template v-else>
        <label class="flex items-center gap-3 cursor-pointer">
          <UCheckbox :model-value="needsHelpWithHomework" @update:model-value="$emit('update:needsHelpWithHomework', $event)" />
          <span class="text-sm text-gray-700 dark:text-gray-300">
            {{ $t('account.booking.create.specialConditions.needsHelpWithHomework') }}
          </span>
        </label>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  bookingType: 'offline' | 'online'
  childIsSick: boolean
  hasSpecialNeedsChild: boolean
  needsHelpWithHomework: boolean
  needsOutdoorActivities: boolean
  needsCarTransportation: boolean
  needsWalking: boolean
}>()

defineEmits<{
  'update:childIsSick': [value: boolean]
  'update:hasSpecialNeedsChild': [value: boolean]
  'update:needsHelpWithHomework': [value: boolean]
  'update:needsOutdoorActivities': [value: boolean]
  'update:needsCarTransportation': [value: boolean]
  'update:needsWalking': [value: boolean]
}>()
</script>

