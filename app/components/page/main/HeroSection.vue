<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const siteConfig = useSiteConfig()

const anna = { skin: '#f5c7a9', skin2: '#e7ad8c', hair: '#3b2620' }
const maria = { skin: '#e9b48f', skin2: '#d79b75', hair: '#1f1714' }
const natali = { skin: '#c98d68', skin2: '#b77a56', hair: '#2b1a14' }

const places = computed(() => [
  `${t('home.places.tbilisi')}, ${t('home.places.vake')}`,
  `${t('home.places.tbilisi')}, ${t('home.places.saburtalo')}`,
  `${t('home.places.tbilisi')}, ${t('home.places.mtatsminda')}`,
  t('home.places.batumi'),
  t('home.places.kutaisi')
])
const cities = computed(() => [t('home.places.tbilisi'), t('home.places.batumi'), t('home.places.kutaisi')])

const place = ref('')
const date = ref('')
const dateType = ref<'text' | 'date'>('text')

watchEffect(() => {
  if (!place.value || !places.value.includes(place.value)) place.value = places.value[0] ?? ''
})

const search = () => {
  const query: Record<string, string> = {}
  if (place.value) query.city = place.value
  if (date.value) query.date = date.value
  navigateTo(localePath({ path: '/search', query }))
}

const onDateBlur = () => {
  if (!date.value) dateType.value = 'text'
}

const scene = ref<HTMLElement | null>(null)

const onPointerMove = (event: PointerEvent) => {
  const el = scene.value
  if (!el || !window.matchMedia('(pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const rect = el.getBoundingClientRect()
  const x = (event.clientX - rect.left) / rect.width - 0.5
  const y = (event.clientY - rect.top) / rect.height - 0.5
  el.querySelectorAll<HTMLElement>('[data-depth]').forEach((item) => {
    const depth = Number(item.dataset.depth)
    const rotate = item.dataset.rotate ?? ''
    item.style.transform = `translate3d(${-x * depth}px, ${-y * depth}px, 0) ${rotate}`
  })
}
</script>

<template>
  <section class="hero">
    <div class="wrap">
      <div class="stage grain" @pointermove="onPointerMove">
        <div class="hero-copy">
          <span class="live">
            <span class="dot" aria-hidden="true" />
            <span><b>{{ t('home.hero.liveCount', { count: 37 }) }}</b> {{ t('home.hero.liveToday') }}<span class="hide-m">{{ ` ${t('home.hero.liveCity')}` }}</span></span>
          </span>

          <h1 class="display">
            {{ t('home.hero.titleStart') }}
            <span class="inl" aria-hidden="true">
              <i style="background:#ffe1d6"><PageMainSitterAvatar variant="anna" v-bind="anna" top="#e8573a" top2="#d14328" /></i>
              <i style="background:#efeaff"><PageMainSitterAvatar variant="maria" v-bind="maria" top="#9f8bf0" top2="#8a74e6" /></i>
              <i style="background:#fff1c7"><PageMainSitterAvatar variant="natali" v-bind="natali" top="#ffc93d" top2="#f5b72c" /></i>
            </span>
            {{ t('home.hero.titleMid') }}
            <span class="hl">{{ t('home.hero.titleAccent') }}<svg viewBox="0 0 300 24" preserveAspectRatio="none" aria-hidden="true"><path d="M4 16C60 6 120 4 180 9s90 6 116-1" fill="none" stroke="#ffc93d" stroke-width="9" stroke-linecap="round" /></svg></span>
            {{ t('home.hero.titleEnd') }}
          </h1>
          <p class="lead">{{ t('home.hero.subtitle') }}.</p>

          <form class="search" role="search" @submit.prevent="search">
            <div class="field">
              <span class="fi" aria-hidden="true"><UIcon name="i-lucide-map-pin" class="ico" /></span>
              <div class="field-body">
                <label for="home-place">{{ t('home.hero.where') }}</label>
                <select id="home-place" v-model="place">
                  <option v-for="option in places" :key="option" :value="option">{{ option }}</option>
                </select>
              </div>
            </div>
            <div class="field">
              <span class="fi" aria-hidden="true"><UIcon name="i-lucide-calendar" class="ico" /></span>
              <div class="field-body">
                <label for="home-when">{{ t('home.hero.when') }}</label>
                <input
                  id="home-when"
                  v-model="date"
                  :type="dateType"
                  :placeholder="t('home.hero.anyTime')"
                  @focus="dateType = 'date'"
                  @blur="onDateBlur"
                >
              </div>
            </div>
            <button class="btn btn-coral" type="submit">
              <UIcon name="i-lucide-search" class="ico" />{{ t('home.hero.cta') }}
            </button>
          </form>

          <div class="cities">
            <span class="hide-m">{{ t('home.hero.popular') }}</span>
            <NuxtLinkLocale v-for="city in cities" :key="city" :to="{ path: '/search', query: { city } }">{{ city }}</NuxtLinkLocale>
          </div>

          <NuxtLinkLocale to="/register" class="sitter-link">
            <span class="sb" aria-hidden="true"><UIcon name="i-mdi-heart" class="ico" /></span>
            <span>{{ t('home.hero.babysitterPrompt') }} <strong>{{ t('home.hero.createProfile') }}</strong></span>
            <UIcon name="i-lucide-arrow-right" class="ico" style="color:#fff" aria-hidden="true" />
          </NuxtLinkLocale>
        </div>

        <div ref="scene" class="scene" aria-hidden="true">
          <svg class="blob" viewBox="0 0 600 600">
            <defs>
              <radialGradient id="home-blob" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="#ffd9cd" /><stop offset=".5" stop-color="#f59a80" /><stop offset="1" stop-color="#e8573a" /></radialGradient>
            </defs>
            <path fill="url(#home-blob)" d="M428 82c66 44 118 118 108 196-9 80-76 160-158 198-82 39-180 34-240-14C78 414 50 318 72 232c22-86 92-158 170-176 78-18 120-18 186 26Z" />
            <path fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="2" stroke-dasharray="2 10" stroke-linecap="round" d="M120 470c80-40 260-20 360-140" />
          </svg>
          <div class="ring" data-depth="22" data-rotate="rotateX(55deg) rotate(-20deg)" />
          <div class="orb orb-butter" data-depth="30" />
          <div class="orb orb-coral" data-depth="18" />
          <div class="orb orb-lilac" data-depth="26" />

          <div class="seal" data-depth="14">
            <div class="ring-bg" />
            <svg class="rot" viewBox="0 0 120 120">
              <defs><path id="home-seal-circle" d="M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1-92 0" /></defs>
              <text font-family="Unbounded" font-weight="600" font-size="10.4" letter-spacing="2.4" fill="#fffdfa"><textPath href="#home-seal-circle">{{ t('home.scene.seal') }}</textPath></text>
            </svg>
            <div class="core"><UIcon name="i-mdi-heart" class="size-[30px] text-white" /></div>
          </div>

          <div class="float f1" style="position:absolute;inset:0;z-index:3" data-depth="8">
            <article class="card pcard">
              <div class="ph">
                <PageMainSitterAvatar class="av" variant="anna" v-bind="anna" top="#fffdfa" top2="#ffe1d6" />
                <span class="badge"><span class="ck"><UIcon name="i-lucide-check" class="size-3" /></span>{{ t('home.scene.verified') }}</span>
                <span class="fav"><UIcon name="i-mdi-heart" class="size-[18px]" /></span>
              </div>
              <div class="body">
                <div class="row">
                  <h3>{{ t('home.featured.sitters.anna.name') }}</h3>
                  <span class="star"><UIcon name="i-mdi-star" />4.9</span>
                </div>
                <p class="meta">{{ t('home.scene.sitterMeta') }}</p>
                <div class="langs"><span>RU</span><span>KA</span><span>EN</span></div>
                <div class="foot">
                  <span class="price">25 {{ siteConfig.currency }}<small>{{ t('home.featured.perHour') }}</small></span>
                  <span class="btn btn-coral">{{ t('home.scene.choose') }}</span>
                </div>
              </div>
            </article>
          </div>

          <div class="float f2 bubble" data-depth="20">
            <span class="mini"><PageMainSitterAvatar variant="anna" v-bind="anna" top="#e8573a" top2="#d14328" /></span>
            <div class="msg"><small>{{ t('home.scene.chatAuthor') }}</small>{{ t('home.scene.chatText') }}<span class="typing"><i /><i /><i /></span></div>
          </div>

          <div class="float f3 card booking" data-depth="28" data-rotate="rotate(3deg)">
            <div class="bh">
              <span class="okc"><UIcon name="i-lucide-check" class="size-5" /></span>
              <div><b>{{ t('home.scene.bookingTitle') }}</b><span>{{ t('home.scene.bookingTime') }}</span></div>
            </div>
            <dl>
              <dt>{{ t('home.scene.where') }}</dt><dd>{{ t('home.scene.whereValue') }}</dd>
              <dt>{{ t('home.scene.kids') }}</dt><dd>{{ t('home.scene.kidsValue') }}</dd>
              <dt>{{ t('home.scene.payment') }}</dt><dd>{{ t('home.scene.paymentValue') }}</dd>
            </dl>
            <div class="bar"><i /></div>
          </div>

          <div class="float f4 card rating" data-depth="16" data-rotate="rotate(-4deg)">
            <span class="score"><UIcon name="i-mdi-star" class="size-[22px]" /></span>
            <div>
              <div class="big">4.9<small>/5</small></div>
              <p>{{ t('home.hero.trusted') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
