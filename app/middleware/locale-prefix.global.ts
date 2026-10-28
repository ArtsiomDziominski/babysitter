// Страховка для клиентских переходов по ссылкам без префикса локали
// (например, ссылки внутри статей блога из Strapi): /search -> /ru/search.
// Прямые заходы на такие адреса редиректит server/middleware/locale-redirect.ts
export default defineNuxtRouteMiddleware((to) => {
  if (to.matched.length) return

  const { locales } = useNuxtApp().$i18n
  const firstSegment = to.path.split('/')[1] || ''
  if (locales.value.some((l) => l.code === firstSegment)) return

  return navigateTo(useLocalePath()(to.fullPath), { replace: true })
})
