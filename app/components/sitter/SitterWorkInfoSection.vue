<template>
  <div class="space-y-6">
    <div v-if="sitter.workConditions" class="bg-default rounded-xl border border-default p-6 md:p-8">
      <div class="flex items-center gap-3 mb-6">
        <div class="p-2 bg-primary/10 rounded-lg">
          <Icon name="i-lucide-file-text" size="24" class="text-primary" />
        </div>
        <h3 class="text-xl font-bold text-highlighted">
          Условия работы
        </h3>
      </div>
      <p class="text-default leading-relaxed whitespace-pre-line">
        {{ sitter.workConditions }}
      </p>
    </div>

    <div v-if="sitter.safetyInfo" class="bg-default rounded-xl border border-default p-6 md:p-8">
      <div class="flex items-center gap-3 mb-6">
        <div class="p-2 bg-primary/10 rounded-lg">
          <Icon name="i-lucide-shield-check" size="24" class="text-primary" />
        </div>
        <h3 class="text-xl font-bold text-highlighted">
          Безопасность
        </h3>
      </div>
      <p class="text-default leading-relaxed whitespace-pre-line">
        {{ sitter.safetyInfo }}
      </p>
    </div>

    <div v-if="!sitter.workConditions && !sitter.safetyInfo" class="bg-default rounded-xl border border-default p-12 text-center">
      <Icon name="i-lucide-info" size="48" class="text-dimmed mx-auto mb-4" />
      <p class="text-muted text-lg">
        Информация о работе не указана
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Sitter } from '~/types/sitter'

defineProps<{
  sitter: Sitter
}>()
</script>

