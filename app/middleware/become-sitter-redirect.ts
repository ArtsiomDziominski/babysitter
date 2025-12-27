export default defineNuxtRouteMiddleware((to) => {
  const { locale } = useI18n()
  
  const localizedUrls: Record<string, string> = {
    ru: '/kak-stat-bebisitterom',
    en: '/how-to-become-babysitter',
    uk: '/yak-staty-bebisiterom',
    be: '/yak-stats-bebisiteram',
    ka: '/rogor-gavides-bebisiteri'
  }
  
  if (to.path === '/become-sitter') {
    const targetUrl = localizedUrls[locale.value] || localizedUrls.ru
    return navigateTo(targetUrl)
  }
})

