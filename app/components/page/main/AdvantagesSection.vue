<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <section class="sec" aria-labelledby="home-why-title">
    <div class="wrap">
      <div class="why grain">
        <div class="why-head">
          <div>
            <span class="eyebrow">{{ t('home.advantages.eyebrow') }}</span>
            <h2 id="home-why-title" class="display">{{ t('home.advantages.title') }}</h2>
          </div>
          <p class="intro">{{ t('home.advantages.intro') }}</p>
        </div>

        <div class="why-art">
          <svg class="shield" viewBox="0 0 300 300" aria-hidden="true">
            <defs>
              <linearGradient id="home-sh" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffa48c" /><stop offset=".55" stop-color="#e8573a" /><stop offset="1" stop-color="#a8331c" /></linearGradient>
              <linearGradient id="home-sh2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55" /><stop offset="1" stop-color="#fff" stop-opacity="0" /></linearGradient>
              <radialGradient id="home-shd" cx="50%" cy="50%"><stop offset="0" stop-color="#000" stop-opacity=".5" /><stop offset="1" stop-color="#000" stop-opacity="0" /></radialGradient>
            </defs>
            <ellipse cx="150" cy="282" rx="96" ry="12" fill="url(#home-shd)" />
            <path d="M150 22 246 58v78c0 64-44 112-96 132-52-20-96-68-96-132V58z" fill="#7e3122" transform="translate(8 10)" />
            <path d="M150 22 246 58v78c0 64-44 112-96 132-52-20-96-68-96-132V58z" fill="url(#home-sh)" />
            <path d="M150 34 234 66v24c-40 10-90 6-168-10V66z" fill="url(#home-sh2)" />
            <path d="M108 140l30 28 56-60" fill="none" stroke="#fff" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" />
            <circle cx="252" cy="40" r="18" fill="#ffd56b" />
            <path d="M40 210c0-8 6-14 14-14" stroke="#ffd56b" stroke-width="5" fill="none" stroke-linecap="round" />
          </svg>
          <div class="why-chip"><span class="dot" aria-hidden="true" />{{ t('home.advantages.chip') }}</div>
        </div>

        <div class="feats">
          <div class="feat">
            <span class="i3d" aria-hidden="true"><UIcon name="i-lucide-clipboard-check" /></span>
            <h3>{{ t('home.advantages.verified.title') }}</h3>
            <p>{{ t('home.advantages.verified.short') }}</p>
          </div>
          <div class="feat">
            <span class="i3d y" aria-hidden="true"><UIcon name="i-lucide-shield-check" /></span>
            <h3>{{ t('home.advantages.safe.title') }}</h3>
            <p>{{ t('home.advantages.safe.description') }}</p>
          </div>
          <div class="feat">
            <span class="i3d l" aria-hidden="true"><UIcon name="i-lucide-clock" /></span>
            <h3>{{ t('home.advantages.flexible.title') }}</h3>
            <p>{{ t('home.advantages.flexible.short') }}</p>
          </div>
          <div class="feat">
            <span class="i3d" aria-hidden="true"><UIcon name="i-lucide-headset" /></span>
            <h3>{{ t('home.advantages.support.title') }}</h3>
            <p>{{ t('home.advantages.support.short') }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
