<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <section class="sec" aria-labelledby="home-cta-title">
    <div class="wrap">
      <div class="cta grain">
        <svg class="deco" style="left:-80px;top:-80px;width:360px;opacity:.5" viewBox="0 0 200 200" aria-hidden="true"><path fill="#f9a58f" d="M150 30c30 26 40 76 16 112s-80 52-118 34S-4 116 8 76 54 10 92 8s38-4 58 22Z" /></svg>
        <svg class="deco" style="right:-60px;bottom:-90px;width:380px;opacity:.55" viewBox="0 0 200 200" aria-hidden="true"><path fill="#b9381c" d="M150 30c30 26 40 76 16 112s-80 52-118 34S-4 116 8 76 54 10 92 8s38-4 58 22Z" /></svg>
        <div class="deco orb orb-butter o1" style="right:9%;top:16%;width:84px;height:84px" aria-hidden="true" />
        <div class="deco orb orb-lilac o2" style="left:12%;bottom:18%;width:52px;height:52px" aria-hidden="true" />
        <div class="deco av-f a1" style="left:7%;top:22%;transform:rotate(-8deg);background:#ffe1d6" aria-hidden="true">
          <PageMainSitterAvatar variant="anna" skin="#f5c7a9" skin2="#e7ad8c" hair="#3b2620" top="#1c1917" top2="#3a3330" />
        </div>
        <div class="deco av-f a2" style="right:8%;bottom:20%;transform:rotate(7deg);background:#fff1c7" aria-hidden="true">
          <PageMainSitterAvatar variant="natali" skin="#c98d68" skin2="#b77a56" hair="#2b1a14" top="#e8573a" top2="#d14328" />
        </div>

        <h2 id="home-cta-title" class="display">{{ t('home.cta.title') }}</h2>
        <p>{{ t('home.cta.lead') }}</p>
        <div class="acts">
          <NuxtLinkLocale to="/search" class="btn btn-white"><UIcon name="i-lucide-search" class="ico" />{{ t('home.cta.ctaParent') }}</NuxtLinkLocale>
          <NuxtLinkLocale to="/register" class="btn btn-dark">{{ t('home.cta.sitter.cta') }} <UIcon name="i-lucide-arrow-right" class="ico arr" /></NuxtLinkLocale>
        </div>
      </div>
    </div>
  </section>
</template>
