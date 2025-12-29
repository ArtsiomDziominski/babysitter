export const useBreakpoint = () => {
  const isMobile = ref(false)
  const isTablet = ref(false)
  const isDesktop = ref(false)

  const checkBreakpoint = () => {
    if (process.client) {
      const width = window.innerWidth
      isMobile.value = width < 1280
      isTablet.value = width >= 768 && width < 1280
      isDesktop.value = width >= 1280
    }
  }

  onMounted(() => {
    checkBreakpoint()
    if (process.client) {
      window.addEventListener('resize', checkBreakpoint)
    }
  })

  onUnmounted(() => {
    if (process.client) {
      window.removeEventListener('resize', checkBreakpoint)
    }
  })

  return {
    isMobile: readonly(isMobile),
    isTablet: readonly(isTablet),
    isDesktop: readonly(isDesktop)
  }
}

