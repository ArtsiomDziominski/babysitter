<template>
  <div class="mb-6 border-b border-default overflow-x-auto scrollbar-hide">
    <UNavigationMenu
      :items="navItems"
      variant="link"
      highlight
      class="w-max"
      :ui="{ linkLabel: 'overflow-visible' }"
    />
  </div>
</template>

<script setup lang="ts">
interface MenuItem {
  to: string
  label: string
  section: string
}

interface Props {
  items: MenuItem[]
  activeSection: string
}

const props = defineProps<Props>()
const { t } = useI18n()
const localePath = useLocalePath()

const navItems = computed(() => props.items.map(item => ({
  label: t(item.label),
  to: localePath(item.to),
  active: props.activeSection === item.section
})))
</script>
