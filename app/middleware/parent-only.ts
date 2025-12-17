export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()

  if (authStore.user.role !== 'parent') {
    return navigateTo('/search')
  }
})

