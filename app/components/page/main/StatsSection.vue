<script setup lang="ts">
const { t } = useI18n()

const services = computed(() => ['evening', 'kindergarten', 'club', 'birthday', 'homework'].map(key => t(`home.ribbon.${key}`)))
const places = computed(() => ['vake', 'saburtalo', 'mtatsminda', 'didube', 'gldani', 'batumi', 'kutaisi', 'isani', 'ortachala'].map(key => t(`home.places.${key}`)))
</script>

<template>
  <section>
    <div class="wrap">
      <div class="stats">
        <div class="stat s1">
          <div class="n">500<sup>+</sup></div>
          <p>
            {{ t('home.statsCards.sitters') }}
            <span class="stack" aria-hidden="true">
              <i style="background:#ffe1d6"><PageMainSitterAvatar variant="anna" skin="#f5c7a9" skin2="#e7ad8c" hair="#3b2620" top="#e8573a" top2="#d14328" /></i>
              <i style="background:#efeaff"><PageMainSitterAvatar variant="maria" skin="#e9b48f" skin2="#d79b75" hair="#1f1714" top="#9f8bf0" top2="#8a74e6" /></i>
              <i style="background:#fff"><PageMainSitterAvatar variant="elena" skin="#f2c4a0" skin2="#e2aa83" hair="#8a3b22" top="#1c1917" top2="#3a3330" /></i>
            </span>
          </p>
        </div>
        <div class="stat s2"><div class="n">2 000<sup>+</sup></div><p>{{ t('home.statsCards.families') }}</p></div>
        <div class="stat s3"><div class="n">5 000<sup>+</sup></div><p>{{ t('home.statsCards.bookings') }}</p></div>
        <div class="stat s4">
          <div class="n">24/7</div>
          <p>{{ t('home.statsCards.support') }} <span class="pill"><span class="dot" aria-hidden="true" />{{ t('home.statsCards.online') }}</span></p>
        </div>
      </div>
    </div>

    <div class="ribbons" aria-hidden="true">
      <div class="rib rib-2">
        <div v-for="copy in 2" :key="copy" class="track">
          <span>
            <template v-for="item in services" :key="item">{{ item }} <UIcon name="i-mdi-heart" /> </template>
          </span>
        </div>
      </div>
      <div class="rib rib-1">
        <div v-for="copy in 2" :key="copy" class="track">
          <span>
            <template v-for="item in places" :key="item">{{ item }} <UIcon name="i-mdi-star-four-points" /> </template>
          </span>
        </div>
      </div>
    </div>
  </section>
</template>
