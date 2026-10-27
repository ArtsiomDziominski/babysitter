<script setup lang="ts">
const { t } = useI18n()

const reviews = ['4', '3', '7']

const initials = (name: string) => name.split(' ').map(part => part[0]).join('').toUpperCase()
</script>

<template>
  <section class="sec" aria-labelledby="home-reviews-title">
    <div class="wrap">
      <div class="sec-head">
        <div>
          <span class="eyebrow">{{ t('home.reviews.label') }}</span>
          <h2 id="home-reviews-title" class="display">{{ t('home.reviews.title') }}</h2>
        </div>
        <div class="agg">
          <span class="big">4.9</span>
          <p><span style="color:#e8a10f;letter-spacing:2px">★★★★★</span><br>{{ t('home.reviews.summary') }}<br>{{ t('home.reviews.summaryCities') }}</p>
        </div>
      </div>

      <div class="revs">
        <figure v-for="key in reviews" :key="key" class="rev" style="margin:0">
          <div class="stars5" role="img" :aria-label="t('home.reviews.stars')">
            <UIcon v-for="i in 5" :key="i" name="i-mdi-star" />
          </div>
          <div class="q" aria-hidden="true">“</div>
          <blockquote>{{ t(`home.testimonials.${key}.text`) }}</blockquote>
          <figcaption class="who">
            <span class="ini">{{ initials(t(`home.testimonials.${key}.name`)) }}</span>
            <div><b>{{ t(`home.testimonials.${key}.name`) }}</b><span>{{ t(`home.testimonials.${key}.city`) }}</span></div>
          </figcaption>
        </figure>
      </div>
    </div>
  </section>
</template>
