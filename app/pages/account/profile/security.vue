<template>
  <div class="flex-1">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-8">
        {{ $t('account.security.title') }}
      </h1>

      <div class="space-y-8">
        <PageAccountChangeEmailForm />
        <PageAccountChangePasswordForm />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})
</script>

