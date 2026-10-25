<template>
  <div class="bg-default rounded-xl border border-default p-6">
    <div class="space-y-4 mb-6">
      <div v-if="sitter.priceOneChild || sitter.priceTwoChildren || sitter.priceThreeChildren">
        <div class="text-sd font-semibold text-highlighted mb-3">
          {{ $t('bookings.sitter.priceCard.pricesByChildrenCount') }}
        </div>
        <div class="space-y-2">
          <div v-if="sitter.priceOneChild" class="flex justify-between items-center text-sm">
            <span class="text-toned">{{ $t('bookings.sitter.priceCard.oneChild') }}</span>
            <span class="font-semibold text-highlighted">{{ parseFloat(sitter.priceOneChild) }} {{ siteConfig.currency }}{{ $t('bookings.sitter.perHour') }}</span>
          </div>
          <div v-if="sitter.priceTwoChildren" class="flex justify-between items-center text-sm">
            <span class="text-toned">{{ $t('bookings.sitter.priceCard.twoChildren') }}</span>
            <span class="font-semibold text-highlighted">{{ parseFloat(sitter.priceTwoChildren) }} {{ siteConfig.currency }}{{ $t('bookings.sitter.perHour') }}</span>
          </div>
          <div v-if="sitter.priceThreeChildren" class="flex justify-between items-center text-sm">
            <span class="text-toned">{{ $t('bookings.sitter.priceCard.threeChildren') }}</span>
            <span class="font-semibold text-highlighted">{{ parseFloat(sitter.priceThreeChildren) }} {{ siteConfig.currency }}{{ $t('bookings.sitter.perHour') }}</span>
          </div>
        </div>
      </div>

      <div v-if="sitter.onlineLesson" class="pt-4 border-t border-default">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-2">
            <Icon name="i-lucide-monitor" size="18" class="text-primary" />
            <span class="text-sm font-semibold text-highlighted">{{ $t('bookings.sitter.priceCard.onlineLesson') }}</span>
          </div>
          <span class="font-semibold text-highlighted">{{ parseFloat(sitter.onlineLesson) }} {{ siteConfig.currency }}{{ $t('bookings.sitter.perHour') }}</span>
        </div>
      </div>

      <div v-if="sitter.minOrderAmount" class="pt-4 border-t border-default">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-2">
            <Icon name="i-lucide-wallet" size="18" class="text-primary" />
            <span class="text-sm font-semibold text-highlighted">{{ $t('bookings.sitter.priceCard.minOrder') }}</span>
          </div>
          <span class="font-semibold text-highlighted">{{ parseFloat(sitter.minOrderAmount) }} {{ siteConfig.currency }}</span>
        </div>
      </div>
    </div>

    <div v-if="sitter.paymentMethods && sitter.paymentMethods.length > 0" class="pt-6 border-t border-default">
      <div class="text-sm font-semibold text-highlighted mb-3">
        {{ $t('bookings.sitter.priceCard.paymentMethods') }}
      </div>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="method in sitter.paymentMethods"
          :key="method"
          class="px-3 py-1.5 bg-elevated text-default rounded-lg text-sm"
        >
          {{ method }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Sitter } from '~/types/sitter'

const siteConfig = useSiteConfig()

defineProps<{
  sitter: Sitter
}>()

</script>

