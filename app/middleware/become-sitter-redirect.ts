export default defineNuxtRouteMiddleware((to) => {
  if (useRouteBaseName()(to) !== 'become-sitter') return

  // Адрес страницы в текущей локали берётся из её definePageMeta({ i18n: { paths } })
  return navigateTo(useLocalePath()('how-to-become-babysitter'))
})
