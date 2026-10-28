import { UserRole } from '~/const/roles'

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  const localePath = useLocalePath()
  const routeName = useRouteBaseName()(to)

  const isChooseRolePage = routeName === 'choose-role'

  if (!authStore.isAuthenticated) {
    if (isChooseRolePage) {
      return navigateTo(localePath('/login'))
    }
    return
  }

  const hasRole = !!authStore.user?.role
  const targetByRole = authStore.user?.role === UserRole.PARENT ? '/search' : '/account/profile'

  if (!hasRole && !isChooseRolePage) {
    return navigateTo(localePath('/choose-role'))
  }

  if (hasRole && isChooseRolePage) {
    return navigateTo(localePath(targetByRole))
  }
})

