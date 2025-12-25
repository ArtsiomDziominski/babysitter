export default defineNuxtPlugin(() => {
  if (!process.client) return

  // Просто инициализируем WebSocket, watch уже есть в useWebSocket
  useWebSocket()
})

