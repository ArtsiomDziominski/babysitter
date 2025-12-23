import { UserRole } from '~/const/roles'

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()

  const isChooseRolePage = to.path === '/choose-role'
  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(to.path)

  if (!authStore.isAuthenticated) {
    if (isChooseRolePage) {
      return navigateTo('/login')
    }
    return
  }

  const hasRole = !!authStore.user?.role
  const targetByRole = authStore.user?.role === UserRole.PARENT ? '/search' : '/account/profile'

  if (!hasRole && !isChooseRolePage) {
    return navigateTo('/choose-role')
  }

  if (hasRole && isChooseRolePage) {
    return navigateTo(targetByRole)
  }
})

