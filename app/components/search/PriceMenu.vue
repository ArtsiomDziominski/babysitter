<template>
  <div class="relative group" ref="triggerRef">
    <div class="text-2xl max-xl:text-lg font-bold text-gray-900 dark:text-white cursor-pointer break-words">
      {{ priceOneChild ? parseFloat(priceOneChild) : 0 }} {{ siteConfig.currency }}
      <span class="text-sm max-xl:text-xs font-normal text-gray-500 dark:text-gray-400">
        {{ $t('bookings.sitter.perHour') }}
      </span>
    </div>
    <Teleport to="body">
      <div
        v-if="isHovered"
        ref="menuRef"
        class="fixed w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-[9999] p-4"
        :style="menuStyle"
      >
        <div class="space-y-3">
          <div v-if="priceOneChild" class="flex justify-between items-center">
            <span class="text-sm text-gray-600 dark:text-gray-400">1 ребенок:</span>
            <span class="text-sm font-semibold text-gray-900 dark:text-white">
              {{ parseFloat(priceOneChild) }} {{ siteConfig.currency }}/час
            </span>
          </div>
          <div v-if="priceTwoChildren" class="flex justify-between items-center">
            <span class="text-sm text-gray-600 dark:text-gray-400">2 ребенка:</span>
            <span class="text-sm font-semibold text-gray-900 dark:text-white">
              {{ parseFloat(priceTwoChildren) }} {{ siteConfig.currency }}/час
            </span>
          </div>
          <div v-if="priceThreeChildren" class="flex justify-between items-center">
            <span class="text-sm text-gray-600 dark:text-gray-400">3 ребенка:</span>
            <span class="text-sm font-semibold text-gray-900 dark:text-white">
              {{ parseFloat(priceThreeChildren) }} {{ siteConfig.currency }}/час
            </span>
          </div>
          <div v-if="onlineLesson" class="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
            <span class="text-sm text-gray-600 dark:text-gray-400">Онлайн урок:</span>
            <span class="text-sm font-semibold text-gray-900 dark:text-white">
              {{ parseFloat(onlineLesson) }} {{ siteConfig.currency }}/час
            </span>
          </div>
          <div v-if="minOrderAmount" class="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
            <span class="text-sm text-gray-600 dark:text-gray-400">Минимальный заказ:</span>
            <span class="text-sm font-semibold text-gray-900 dark:text-white">
              {{ parseFloat(minOrderAmount) }} {{ siteConfig.currency }}
            </span>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const siteConfig = useSiteConfig()

defineProps<{
  priceOneChild?: string
  priceTwoChildren?: string
  priceThreeChildren?: string
  onlineLesson?: string
  minOrderAmount?: string
}>()

const triggerRef = ref<HTMLElement | null>(null)
const menuRef = ref<HTMLElement | null>(null)
const isHovered = ref(false)

const menuStyle = computed(() => {
  if (!triggerRef.value) return {}
  
  const rect = triggerRef.value.getBoundingClientRect()
  
  return {
    top: `${rect.bottom + 8}px`,
    right: `${window.innerWidth - rect.right}px`
  }
})

const handleMouseEnter = () => {
  isHovered.value = true
}

const handleMouseLeave = () => {
  isHovered.value = false
}

onMounted(() => {
  if (triggerRef.value) {
    triggerRef.value.addEventListener('mouseenter', handleMouseEnter)
    triggerRef.value.addEventListener('mouseleave', handleMouseLeave)
  }
})

onUnmounted(() => {
  if (triggerRef.value) {
    triggerRef.value.removeEventListener('mouseenter', handleMouseEnter)
    triggerRef.value.removeEventListener('mouseleave', handleMouseLeave)
  }
  if (menuRef.value) {
    menuRef.value.removeEventListener('mouseenter', handleMouseEnter)
    menuRef.value.removeEventListener('mouseleave', handleMouseLeave)
  }
})

watch(isHovered, (newVal) => {
  if (newVal && menuRef.value) {
    nextTick(() => {
      if (menuRef.value) {
        menuRef.value.addEventListener('mouseenter', handleMouseEnter)
        menuRef.value.addEventListener('mouseleave', handleMouseLeave)
      }
    })
  }
})
</script>

