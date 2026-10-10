const LOCALIZED_URLS: Record<string, string> = {
  ru: '/kak-stat-bebisitterom',
  en: '/how-to-become-babysitter',
  uk: '/yak-staty-bebisiterom',
  ka: '/rogor-gavides-bebisiteri'
}

export default defineNuxtRouteMiddleware((to) => {
  if (to.path !== '/become-sitter') return

  // useI18n() работает только внутри setup компонента — в middleware берём локаль из экземпляра i18n
  const locale = useNuxtApp().$i18n.locale.value
  return navigateTo(LOCALIZED_URLS[locale] || LOCALIZED_URLS.ru)
})
