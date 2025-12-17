<script setup lang="ts">
const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <header class="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur">
      <div class="container mx-auto flex items-center justify-between px-4 py-4">
        <NuxtLink to="/" class="text-lg font-semibold">
          Babysitter
        </NuxtLink>
        <UButton color="gray" variant="ghost" @click="handleLogout">
          Выйти
        </UButton>
      </div>
    </header>

    <main class="container mx-auto px-4 py-12">
      <slot />
    </main>
  </div>
</template>

