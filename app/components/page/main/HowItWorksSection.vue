<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <section class="sec" aria-labelledby="home-how-title">
    <div class="wrap">
      <div class="sec-head">
        <div>
          <span class="eyebrow">{{ t('home.howItWorks.title') }}</span>
          <h2 id="home-how-title" class="display">{{ t('home.howItWorks.headlineStart') }}<br>{{ t('home.howItWorks.headlineEnd') }}</h2>
        </div>
        <p>{{ t('home.howItWorks.lead') }}</p>
      </div>

      <ol class="steps" style="padding:0;margin:0;list-style:none">
        <li class="step">
          <div class="vig" aria-hidden="true">
            <svg class="map" viewBox="0 0 400 230" preserveAspectRatio="xMidYMid slice">
              <g fill="none" stroke="currentColor" style="color:var(--line-2)" stroke-width="10" stroke-linecap="round">
                <path d="M-10 150C80 130 140 190 230 160S360 90 420 110" /><path d="M120 -10C140 60 110 120 160 240" /><path d="M290 -10c-20 70 30 140 10 250" />
              </g>
              <circle cx="330" cy="70" r="40" fill="#ffd56b" opacity=".35" />
            </svg>
            <div class="ui ui-search">
              <UIcon name="i-lucide-map-pin" class="ico" style="color:var(--coral-text)" />
              <b>{{ t('home.howItWorks.demo.search') }}</b>
              <i><UIcon name="i-lucide-search" class="size-3.5" /></i>
            </div>
            <div class="pin" style="left:22%;top:52%"><span class="pa"><PageMainSitterAvatar variant="anna" skin="#f5c7a9" skin2="#e7ad8c" hair="#3b2620" top="#e8573a" top2="#d14328" /></span></div>
            <div class="pin" style="left:62%;top:38%"><span class="pa" style="background:#efeaff"><PageMainSitterAvatar variant="maria" skin="#e9b48f" skin2="#d79b75" hair="#1f1714" top="#9f8bf0" top2="#8a74e6" /></span></div>
            <div class="pin" style="left:76%;top:62%"><span class="pa" style="background:#fff1c7"><PageMainSitterAvatar variant="natali" skin="#c98d68" skin2="#b77a56" hair="#2b1a14" top="#ffc93d" top2="#f5b72c" /></span></div>
            <div class="pin me" style="left:44%;top:66%"><span class="pa"><UIcon name="i-mdi-heart" class="size-[18px]" /></span></div>
          </div>
          <div class="txt">
            <span class="k">01</span>
            <h3>{{ t('home.howItWorks.step1.title') }}</h3>
            <p>{{ t('home.howItWorks.step1.text') }}</p>
          </div>
        </li>

        <li class="step">
          <div class="vig" aria-hidden="true">
            <div class="vstack">
              <div class="ui ui-prof">
                <div class="r">
                  <span class="av" style="background:#fff1c7"><PageMainSitterAvatar variant="elena" skin="#f2c4a0" skin2="#e2aa83" hair="#8a3b22" top="#1c1917" top2="#3a3330" /></span>
                  <div style="flex:1"><b>{{ t('home.featured.sitters.elena.name') }}</b><span class="s">★★★★★</span> <span style="color:var(--ink-3)">{{ t('home.howItWorks.demo.reviews') }}</span></div>
                  <span style="font-weight:700">5.0</span>
                </div>
                <q>{{ t('home.howItWorks.demo.quote') }}</q>
              </div>
              <div class="back" />
            </div>
          </div>
          <div class="txt">
            <span class="k">02</span>
            <h3>{{ t('home.howItWorks.step2.title') }}</h3>
            <p>{{ t('home.howItWorks.step2.text') }}</p>
          </div>
        </li>

        <li class="step">
          <div class="vig" aria-hidden="true">
            <div class="chat">
              <div class="m me">{{ t('home.howItWorks.demo.ask') }}</div>
              <div class="m">{{ t('home.howItWorks.demo.answer') }}</div>
              <div class="done"><i><UIcon name="i-lucide-check" class="size-3" /></i>{{ t('home.howItWorks.demo.booked') }}</div>
            </div>
          </div>
          <div class="txt">
            <span class="k">03</span>
            <h3>{{ t('home.howItWorks.step3.title') }}</h3>
            <p>{{ t('home.howItWorks.step3.text') }}</p>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>
