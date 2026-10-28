<script setup lang="ts">
const { t } = useI18n()
const siteConfig = useSiteConfig()

const sitters = [
  {
    key: 'anna', rating: '4.9', price: 25, langs: ['RU', 'KA', 'EN'],
    avatar: { skin: '#f5c7a9', skin2: '#e7ad8c', hair: '#3b2620', top: '#e8573a', top2: '#d14328' },
    bg: '#ffe1d6', blob: '#f9b9a6', blobPath: 'M40 120C40 50 110 20 170 40s110 70 90 150-110 110-170 80S40 190 40 120Z'
  },
  {
    key: 'maria', rating: '4.8', price: 30, langs: ['RU', 'KA'],
    avatar: { skin: '#e9b48f', skin2: '#d79b75', hair: '#1f1714', top: '#fffdfa', top2: '#e8e1ff' },
    bg: '#efeaff', blob: '#cfc2ff', blobPath: 'M60 80c50-60 160-50 200 10s10 170-60 190S30 250 30 180 20 130 60 80Z'
  },
  {
    key: 'elena', rating: '5.0', price: 20, langs: ['RU', 'EN'],
    avatar: { skin: '#f2c4a0', skin2: '#e2aa83', hair: '#8a3b22', top: '#1c1917', top2: '#3a3330' },
    bg: '#fff1c7', blob: '#ffd56b', blobPath: 'M50 150c-10-80 60-120 130-110s100 80 80 140-90 100-150 80S56 200 50 150Z'
  },
  {
    key: 'natali', rating: '4.9', price: 35, langs: ['RU', 'KA', 'EN'],
    avatar: { skin: '#c98d68', skin2: '#b77a56', hair: '#2b1a14', top: '#ffc93d', top2: '#f5b72c' },
    bg: '#fde0d8', blob: '#ee876e', blobPath: 'M70 60c60-30 170 0 190 70s-30 150-110 150S20 230 30 160 30 80 70 60Z'
  }
] as const
</script>

<template>
  <section id="sitters" class="sec" aria-labelledby="home-sitters-title">
    <div class="wrap">
      <div class="sec-head">
        <div>
          <span class="eyebrow">{{ t('home.featured.eyebrow') }}</span>
          <h2 id="home-sitters-title" class="display">{{ t('home.featured.title') }}</h2>
        </div>
        <NuxtLinkLocale to="/search" class="btn btn-soft">{{ t('home.featured.viewAll') }} <UIcon name="i-lucide-arrow-right" class="ico arr" /></NuxtLinkLocale>
      </div>

      <div class="sitters">
        <article v-for="sitter in sitters" :key="sitter.key" class="scard">
          <div class="ph">
            <svg class="bb" viewBox="0 0 300 300" preserveAspectRatio="none" aria-hidden="true">
              <rect width="300" height="300" :fill="sitter.bg" />
              <path :d="sitter.blobPath" :fill="sitter.blob" />
            </svg>
            <PageMainSitterAvatar class="av" :variant="sitter.key" v-bind="sitter.avatar" />
            <span class="badge"><span class="ck"><UIcon name="i-lucide-check" class="size-3" /></span>{{ t('home.featured.verifiedFemale') }}</span>
            <button class="fav" type="button" :aria-label="t('home.featured.favorite')"><UIcon name="i-lucide-heart" class="size-[18px]" /></button>
            <span class="rt"><UIcon name="i-mdi-star" />{{ sitter.rating }}</span>
          </div>
          <div class="body">
            <h3>{{ t(`home.featured.sitters.${sitter.key}.name`) }}</h3>
            <p class="loc"><UIcon name="i-lucide-map-pin" />{{ t(`home.featured.sitters.${sitter.key}.meta`) }}</p>
            <div class="langs"><span v-for="lang in sitter.langs" :key="lang">{{ lang }}</span></div>
            <div class="foot">
              <span class="price">{{ sitter.price }} {{ siteConfig.currency }}<small>{{ t('home.featured.perHour') }}</small></span>
              <NuxtLinkLocale to="/search" class="go" :aria-label="t('home.featured.profileOf', { name: t(`home.featured.sitters.${sitter.key}.name`) })">
                <UIcon name="i-lucide-arrow-up-right" class="ico" />
              </NuxtLinkLocale>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
