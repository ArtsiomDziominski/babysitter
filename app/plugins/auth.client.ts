export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()
  const tokenCookie = useCookie<string | null>('access_token')

  // Если серверный рендер не восстановил сессию (статическая страница, ошибка SSR),
  // восстанавливаем её на клиенте, чтобы middleware не отправлял на /login при валидном токене
  if (tokenCookie.value && !authStore.isAuth) {
    await authStore.restoreAuth()
  }
})
