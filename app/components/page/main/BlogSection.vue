<script setup lang="ts">
import type { BlogPost } from '~/types/blog'

const { t } = useI18n()
const articlesComposable = useArticles()

const articles = ref<BlogPost[]>([])
const loading = ref(false)

const loadArticles = async () => {
  loading.value = true
  try {
    const response = await articlesComposable.getArticles({
      limit: 3,
      sort: 'published',
      order: 'desc'
    })
    articles.value = response.data
  } catch (error) {
    console.error('Ошибка загрузки статей:', error)
    articles.value = []
  } finally {
    loading.value = false
  }
}

const coverOf = (article: BlogPost) => {
  const cover = Array.isArray(article.coverImage) ? article.coverImage[0] : article.coverImage
  return cover || article.image || ''
}

const categoryOf = (article: BlogPost) => article.categories?.[0]?.name || article.category

onMounted(() => {
  loadArticles()
})
</script>

<template>
  <section id="blog" class="sec" aria-labelledby="home-blog-title">
    <div class="wrap">
      <div class="sec-head">
        <div>
          <span class="eyebrow">{{ t('home.blog.eyebrow') }}</span>
          <h2 id="home-blog-title" class="display">{{ t('home.blog.title') }}</h2>
        </div>
        <NuxtLink to="/blog" class="btn btn-soft">{{ t('home.blog.cta') }} <UIcon name="i-lucide-arrow-right" class="ico arr" /></NuxtLink>
      </div>

      <div v-if="loading" class="arts" aria-hidden="true">
        <div v-for="i in 3" :key="i" class="art animate-pulse">
          <div class="cv" style="background:var(--surface-2)" />
          <div class="body"><div class="mt"><span class="tg">&nbsp;&nbsp;&nbsp;&nbsp;</span></div><h3>&nbsp;</h3></div>
        </div>
      </div>

      <div v-else-if="articles.length > 0" class="arts">
        <NuxtLink v-for="(article, index) in articles" :key="article.id" :to="`/blog/${article.slug}`" class="art">
          <div class="cv">
            <img v-if="coverOf(article)" :src="coverOf(article)" :alt="article.title" loading="lazy" style="width:100%;height:100%;object-fit:cover;max-width:none">

            <svg v-else-if="index % 3 === 0" viewBox="0 0 400 275" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <defs><linearGradient id="home-a1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffb39f" /><stop offset="1" stop-color="#e8573a" /></linearGradient></defs>
              <rect width="400" height="275" fill="url(#home-a1)" />
              <circle cx="300" cy="80" r="34" fill="#ffd56b" />
              <path d="M0 200C60 150 110 170 160 150s90-70 150-50 70 40 90 40v135H0z" fill="#d14328" opacity=".7" />
              <path d="M0 230c70-30 130-10 200-30s120-10 200 0v75H0z" fill="#af351f" />
              <g transform="translate(176 72)"><path d="M24 0c13 0 24 10 24 24 0 18-24 42-24 42S0 42 0 24C0 10 11 0 24 0Z" fill="#fffdfa" /><circle cx="24" cy="23" r="9" fill="#e8573a" /></g>
              <ellipse cx="200" cy="146" rx="18" ry="5" fill="#7e3122" opacity=".4" />
            </svg>

            <svg v-else-if="index % 3 === 1" viewBox="0 0 400 275" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <rect width="400" height="275" fill="#ffd56b" />
              <circle cx="70" cy="220" r="90" fill="#ffc23d" />
              <g transform="rotate(-6 200 140)">
                <rect x="120" y="50" width="160" height="190" rx="20" fill="#fffdfa" />
                <rect x="170" y="40" width="60" height="22" rx="11" fill="#1c1917" />
                <rect x="140" y="86" width="20" height="20" rx="6" fill="#e8573a" /><path d="m145 96 4 4 7-8" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round" /><rect x="170" y="92" width="86" height="8" rx="4" fill="#e7ddd3" />
                <rect x="140" y="124" width="20" height="20" rx="6" fill="#e8573a" /><path d="m145 134 4 4 7-8" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round" /><rect x="170" y="130" width="64" height="8" rx="4" fill="#e7ddd3" />
                <rect x="140" y="162" width="20" height="20" rx="6" fill="none" stroke="#e7ddd3" stroke-width="3" /><rect x="170" y="168" width="78" height="8" rx="4" fill="#e7ddd3" />
                <rect x="140" y="200" width="20" height="20" rx="6" fill="none" stroke="#e7ddd3" stroke-width="3" /><rect x="170" y="206" width="52" height="8" rx="4" fill="#e7ddd3" />
              </g>
              <circle cx="320" cy="70" r="22" fill="#cfc2ff" />
            </svg>

            <svg v-else viewBox="0 0 400 275" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <defs><radialGradient id="home-coin" cx="35%" cy="30%"><stop offset="0" stop-color="#fff6d6" /><stop offset=".5" stop-color="#ffd56b" /><stop offset="1" stop-color="#d9960f" /></radialGradient></defs>
              <rect width="400" height="275" fill="#cfc2ff" />
              <circle cx="330" cy="240" r="110" fill="#b9a8f7" />
              <g transform="translate(120 150)"><ellipse cx="0" cy="18" rx="56" ry="18" fill="#b07a08" /><rect x="-56" y="-2" width="112" height="20" fill="#b07a08" /><ellipse cx="0" cy="-2" rx="56" ry="18" fill="url(#home-coin)" /></g>
              <g transform="translate(120 126)"><ellipse cx="0" cy="18" rx="56" ry="18" fill="#b07a08" /><rect x="-56" y="-2" width="112" height="20" fill="#b07a08" /><ellipse cx="0" cy="-2" rx="56" ry="18" fill="url(#home-coin)" /></g>
              <g transform="translate(250 120)"><circle r="62" fill="#b07a08" transform="translate(6 6)" /><circle r="62" fill="url(#home-coin)" /><text y="14" text-anchor="middle" font-family="Unbounded" font-weight="700" font-size="38" fill="#7a4f00">₾</text></g>
            </svg>
          </div>
          <div class="body">
            <div class="mt">
              <span v-if="categoryOf(article)" class="tg">{{ categoryOf(article) }}</span>
              <template v-if="article.readTime">{{ t('home.blog.minutes', { n: article.readTime }) }}</template>
            </div>
            <h3>{{ article.title }}</h3>
            <span class="rd">{{ t('home.blog.read') }} <UIcon name="i-lucide-arrow-right" class="ico arr" /></span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
