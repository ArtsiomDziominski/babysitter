export default defineNuxtPlugin(() => {
  if (!process.client) return

  const authStore = useAuthStore()
  const websocket = useWebSocket()

  if (authStore.isAuthenticated && authStore.accessToken) {
    websocket.connect(authStore.accessToken)
  }

  watch(() => authStore.isAuthenticated, (isAuth) => {
    if (isAuth && authStore.accessToken) {
      websocket.connect(authStore.accessToken)
    } else {
      websocket.disconnect()
    }
  })
})

