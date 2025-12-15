export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()
  const tokenCookie = useCookie<string | null>('access_token')

  if (tokenCookie.value && !authStore.isAuth) {
    try {
      await authStore.fetchProfile()
    } catch (error) {
      // Игнорируем ошибки при загрузке профиля на сервере
      // Они будут обработаны на клиенте
    }
  }
})

