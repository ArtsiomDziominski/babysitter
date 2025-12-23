import { UserRole } from '~/const/roles'

export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()

  if (authStore.user.role !== UserRole.BABYSITTER) {
    return navigateTo('/search')
  }
})

