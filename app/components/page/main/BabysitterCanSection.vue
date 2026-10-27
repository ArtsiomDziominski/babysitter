<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <section class="sec" style="padding-top:clamp(40px,5vw,72px)" aria-labelledby="home-services-title">
    <div class="wrap">
      <div class="sec-head">
        <div>
          <span class="eyebrow">{{ t('home.babysitterCan.eyebrow') }}</span>
          <h2 id="home-services-title" class="display">{{ t('home.babysitterCan.titleStart') }} <span class="h-pill" aria-hidden="true" /> {{ t('home.babysitterCan.titleEnd') }}</h2>
        </div>
        <p>{{ t('home.babysitterCan.lead') }}</p>
      </div>

      <div class="bento">
        <article class="tile t-big">
          <span class="num">01</span>
          <svg class="ill" viewBox="0 0 400 360" aria-hidden="true">
            <defs>
              <linearGradient id="home-win" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b2350" /><stop offset="1" stop-color="#5a3f7a" /></linearGradient>
              <linearGradient id="home-house" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff9a7f" /><stop offset="1" stop-color="#e8573a" /></linearGradient>
              <radialGradient id="home-lamp" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ffe9a8" stop-opacity=".95" /><stop offset="1" stop-color="#ffe9a8" stop-opacity="0" /></radialGradient>
            </defs>
            <path d="M70 170 200 64l130 106v150a24 24 0 0 1-24 24H94a24 24 0 0 1-24-24z" fill="url(#home-house)" />
            <path d="M48 178 200 52l152 126" fill="none" stroke="#fffdfa" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" />
            <rect x="112" y="186" width="176" height="128" rx="26" fill="url(#home-win)" />
            <circle cx="250" cy="220" r="16" fill="#ffe08a" /><circle cx="258" cy="214" r="14" fill="#3f3266" />
            <g fill="#ffe9a8"><circle cx="150" cy="210" r="2.4" /><circle cx="180" cy="230" r="1.8" /><circle cx="214" cy="204" r="2" /><circle cx="140" cy="244" r="1.6" /></g>
            <circle cx="166" cy="292" r="50" fill="url(#home-lamp)" />
            <path d="M150 314v-26a16 16 0 0 1 32 0v26z" fill="#ffd56b" />
            <circle cx="166" cy="270" r="13" fill="#fbd3c6" />
            <path d="M228 314v-34a18 18 0 0 1 36 0v34z" fill="#cfc2ff" />
            <circle cx="246" cy="266" r="15" fill="#f5c7a9" />
            <path d="M231 262c0-12 7-19 15-19s15 7 15 19c-6-5-10-7-15-7s-9 2-15 7z" fill="#3b2620" />
            <circle cx="330" cy="70" r="20" fill="#ffd56b" />
          </svg>
          <span class="i3d" aria-hidden="true"><UIcon name="i-lucide-moon" /></span>
          <div>
            <h3>{{ t('home.babysitterCan.services.home') }}</h3>
            <div class="tags">
              <span>{{ t('home.babysitterCan.tags.evening') }}</span>
              <span>{{ t('home.babysitterCan.tags.meeting') }}</span>
              <span>{{ t('home.babysitterCan.tags.night') }}</span>
            </div>
          </div>
        </article>

        <article class="tile">
          <span class="num">02</span>
          <span class="i3d y" aria-hidden="true"><UIcon name="i-lucide-book-open" /></span>
          <h3>{{ t('home.babysitterCan.services.transport') }}</h3>
        </article>

        <article class="tile t-y">
          <span class="num">03</span>
          <span class="i3d" aria-hidden="true"><UIcon name="i-lucide-school" /></span>
          <h3>{{ t('home.babysitterCan.services.school') }}</h3>
        </article>

        <article class="tile t-wide">
          <span class="num">04</span>
          <svg class="ill" viewBox="0 0 260 200" aria-hidden="true">
            <defs>
              <radialGradient id="home-bl1" cx="35%" cy="30%"><stop offset="0" stop-color="#ffd3c6" /><stop offset=".5" stop-color="#f27a5d" /><stop offset="1" stop-color="#c9401f" /></radialGradient>
              <radialGradient id="home-bl2" cx="35%" cy="30%"><stop offset="0" stop-color="#fff6d6" /><stop offset=".5" stop-color="#ffd56b" /><stop offset="1" stop-color="#e3a419" /></radialGradient>
              <radialGradient id="home-bl3" cx="35%" cy="30%"><stop offset="0" stop-color="#ffffff" /><stop offset=".5" stop-color="#b9a8f7" /><stop offset="1" stop-color="#7c63e0" /></radialGradient>
            </defs>
            <path d="M80 100 120 200M150 84 130 200M206 104 150 200" stroke="#6b5fa0" stroke-width="2" fill="none" opacity=".5" />
            <ellipse cx="80" cy="66" rx="40" ry="46" fill="url(#home-bl1)" />
            <ellipse cx="206" cy="72" rx="36" ry="42" fill="url(#home-bl3)" />
            <ellipse cx="150" cy="44" rx="42" ry="48" fill="url(#home-bl2)" />
            <path d="M76 112l4-6 4 6zM146 92l4-6 4 6zM202 114l4-6 4 6z" fill="#6b5fa0" opacity=".6" />
          </svg>
          <span class="i3d l" aria-hidden="true"><UIcon name="i-lucide-cake" /></span>
          <h3 style="max-width:18ch">{{ t('home.babysitterCan.services.party') }}</h3>
        </article>

        <article class="tile">
          <span class="num">05</span>
          <span class="i3d l" aria-hidden="true"><UIcon name="i-lucide-shopping-bag" /></span>
          <h3>{{ t('home.babysitterCan.services.mall') }}</h3>
        </article>

        <article class="tile">
          <span class="num">06</span>
          <span class="i3d y" aria-hidden="true"><UIcon name="i-lucide-house-heart" /></span>
          <h3>{{ t('home.babysitterCan.services.relatives') }}</h3>
        </article>

        <article class="tile t-07">
          <span class="num">07</span>
          <span class="i3d" aria-hidden="true"><UIcon name="i-lucide-soup" /></span>
          <h3>{{ t('home.babysitterCan.services.chores') }}</h3>
        </article>

        <article class="tile t-more">
          <h3>{{ t('home.babysitterCan.more') }}</h3>
          <NuxtLink to="/search" class="btn btn-coral">{{ t('home.babysitterCan.cta') }} <UIcon name="i-lucide-arrow-right" class="ico arr" /></NuxtLink>
        </article>
      </div>
    </div>
  </section>
</template>
