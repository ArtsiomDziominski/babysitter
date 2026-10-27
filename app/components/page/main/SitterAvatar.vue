<script setup lang="ts">
type Variant = 'anna' | 'maria' | 'elena' | 'natali'

const props = withDefaults(defineProps<{
  variant: Variant
  skin: string
  skin2: string
  hair: string
  top: string
  top2: string
  accent?: string
}>(), {
  accent: '#ffd56b'
})
</script>

<template>
  <svg viewBox="0 0 200 200" aria-hidden="true">
    <path v-if="props.variant === 'anna'" :fill="props.hair" d="M56 92c-6-40 18-64 44-64s50 24 44 64l4 42c-30 12-66 12-96 0z" />
    <circle v-if="props.variant === 'maria'" cx="100" cy="36" r="20" :fill="props.hair" />
    <path v-if="props.variant === 'elena'" :fill="props.hair" d="M58 86c0-36 18-56 42-56s42 20 42 56c0 34 12 50 16 76-24 12-92 12-116 0 4-26 16-42 16-76z" />
    <g v-if="props.variant === 'natali'" :fill="props.hair">
      <circle cx="64" cy="98" r="15" /><circle cx="136" cy="98" r="15" /><circle cx="62" cy="122" r="13" /><circle cx="138" cy="122" r="13" />
    </g>

    <path :fill="props.top" d="M24 210c2-48 36-74 76-74s74 26 76 74z" />
    <path :fill="props.top2" d="M78 140c6 12 14 18 22 18s16-6 22-18c-6-3-14-4-22-4s-16 1-22 4z" opacity=".9" />
    <path :fill="props.skin2" d="M86 112h28v30c-8 7-20 7-28 0z" />

    <path v-if="props.variant === 'elena'" :fill="props.hair" d="M62 120c-2 14-6 26-12 38 14 4 26 0 34-10-12-6-18-16-22-28zM138 120c2 14 6 26 12 38-14 4-26 0-34-10 12-6 18-16 22-28z" />
    <ellipse cx="100" cy="90" rx="33" ry="37" :fill="props.skin" />

    <path v-if="props.variant === 'anna'" :fill="props.hair" d="M64 92c-4-34 14-54 38-54 24 0 38 18 34 50-20 0-38-10-48-24-6 14-14 24-24 28z" />
    <template v-if="props.variant === 'maria'">
      <path :fill="props.hair" d="M65 92c-4-30 12-50 35-50s39 20 35 50c-4-16-16-30-35-32-14 4-28 14-35 32z" />
      <circle cx="132" cy="102" r="3.5" :fill="props.accent" />
    </template>
    <path v-if="props.variant === 'elena'" :fill="props.hair" d="M65 96c-4-34 14-54 37-54 22 0 37 16 33 44-14-4-27-14-33-28-8 18-22 32-37 38z" />
    <g v-if="props.variant === 'natali'" :fill="props.hair">
      <circle cx="70" cy="72" r="17" /><circle cx="84" cy="54" r="19" /><circle cx="104" cy="47" r="20" /><circle cx="124" cy="55" r="18" /><circle cx="134" cy="74" r="16" /><circle cx="66" cy="88" r="11" /><circle cx="136" cy="90" r="11" />
    </g>

    <ellipse cx="86" cy="94" rx="3.6" ry="4.2" fill="#2a1d18" />
    <ellipse cx="114" cy="94" rx="3.6" ry="4.2" fill="#2a1d18" />
    <circle cx="78" cy="106" r="7" fill="#ff7a5c" opacity=".28" />
    <circle cx="122" cy="106" r="7" fill="#ff7a5c" opacity=".28" />
    <path d="M92 108q8 7 16 0" fill="none" stroke="#2a1d18" stroke-width="3.2" stroke-linecap="round" />
  </svg>
</template>
