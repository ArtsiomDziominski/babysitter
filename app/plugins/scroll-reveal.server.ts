export default defineNuxtPlugin((nuxtApp) => {
  // Register no-op directive for SSR to avoid "Failed to resolve directive" warnings.
  nuxtApp.vueApp.directive('reveal', {
    getSSRProps() {
      return {}
    }
  })
})
