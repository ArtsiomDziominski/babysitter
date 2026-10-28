<script setup lang="ts">
const authStore = useAuthStore()
const router = useRouter()
const localePath = useLocalePath()

const handleLogout = () => {
  authStore.logout()
  router.push(localePath('/login'))
}
</script>

<template>
  <div class="min-h-screen bg-muted dark:bg-default">
    <header class="border-b bg-white/80 dark:bg-neutral-900/80 backdrop-blur">
      <div class="container mx-auto flex items-center justify-between px-4 py-4">
        <NuxtLinkLocale to="/" class="text-lg font-semibold">
          Babysitter
        </NuxtLinkLocale>
        <UButton color="neutral" variant="ghost" @click="handleLogout">
          Выйти
        </UButton>
      </div>
    </header>

    <main class="container mx-auto px-4 py-12">
      <slot />
    </main>
  </div>
</template>

