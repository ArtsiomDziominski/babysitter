// Редирект со старых адресов без префикса локали (/search, /blog/slug?lang=en)
// на адреса с префиксом (/ru/search, /en/blog/slug).
//
// Язык выбирается так:
// 1. ?lang=xx из старых ссылок и старого sitemap — 301, параметр убирается;
// 2. cookie выбранного языка — 302, у разных пользователей адрес разный;
// 3. для корня "/" — язык браузера (Accept-Language) — 302;
// 4. иначе язык по умолчанию — 301, старые проиндексированные страницы отдавались на нём.

const SKIP_PREFIXES = ['/api/', '/_nuxt/', '/__nuxt', '/_i18n/', '/_ipx/', '/_fonts/', '/_payload']
const COOKIE_KEY = 'i18n_redirected'

// Страница «как стать бебиситтером» имеет свой адрес в каждой локали (см. pages/how-to-become-babysitter.vue).
// Раньше все слаги открывались в любой локали — теперь чужой слаг ведёт на адрес своей локали
const BECOME_BABYSITTER_PATHS: Record<string, string> = {
  ru: '/kak-stat-bebisitterom',
  en: '/how-to-become-babysitter',
  uk: '/yak-staty-bebisiterom',
  ka: '/rogor-gavides-bebisiteri'
}
const BECOME_BABYSITTER_SLUGS = [...Object.values(BECOME_BABYSITTER_PATHS), '/yak-stats-bebisiteram']

function localizePath(path: string, locale: string): string {
  const clean = path.replace(/\/+$/, '')
  if (BECOME_BABYSITTER_SLUGS.includes(clean)) {
    return BECOME_BABYSITTER_PATHS[locale] || BECOME_BABYSITTER_PATHS.ru!
  }
  return clean
}

export default defineEventHandler((event) => {
  if (event.method !== 'GET' && event.method !== 'HEAD') return

  const url = getRequestURL(event)
  const path = url.pathname

  if (SKIP_PREFIXES.some((prefix) => path.startsWith(prefix))) return
  // Файлы: robots.txt, sitemap.xml, favicon.ico, картинки из public
  if (path.split('/').pop()?.includes('.')) return

  const config = useRuntimeConfig()
  const siteConfig = config.public.siteConfig
  const localeCodes = (siteConfig.locales as Array<{ code: string }>).map((l) => l.code)
  const defaultLocale = siteConfig.defaultLocale as string

  const firstSegment = path.split('/')[1] || ''
  if (localeCodes.includes(firstSegment)) {
    const rest = path.slice(firstSegment.length + 1).replace(/\/+$/, '')
    const localized = localizePath(rest, firstSegment)
    if (localized !== rest) {
      return sendRedirect(event, `/${firstSegment}${localized}${url.search}`, 301)
    }
    return
  }

  const query = new URLSearchParams(url.search)
  const langParam = query.get('lang')
  query.delete('lang')

  let locale = defaultLocale
  let code = 301

  if (langParam && localeCodes.includes(langParam)) {
    locale = langParam
  } else {
    const cookieLocale = getCookie(event, COOKIE_KEY)
    if (cookieLocale && localeCodes.includes(cookieLocale)) {
      locale = cookieLocale
      code = 302
    } else if (path === '/') {
      locale = detectFromAcceptLanguage(getHeader(event, 'accept-language'), localeCodes) || defaultLocale
      code = 302
    }
  }

  const search = query.toString()
  const target = `/${locale}${path === '/' ? '' : localizePath(path, locale)}${search ? `?${search}` : ''}`

  return sendRedirect(event, target, code)
})

function detectFromAcceptLanguage(header: string | undefined, localeCodes: string[]): string | undefined {
  if (!header) return

  const languages = header
    .split(',')
    .map((part) => {
      const [tag, ...params] = part.trim().split(';')
      const q = params.find((p) => p.trim().startsWith('q='))
      return { lang: (tag || '').toLowerCase().split('-')[0], q: q ? Number(q.trim().slice(2)) : 1 }
    })
    .filter((item) => item.lang && !Number.isNaN(item.q))
    .sort((a, b) => b.q - a.q)

  return languages.find((item) => localeCodes.includes(item.lang!))?.lang
}
