export default defineI18nConfig(() => ({
  // Если перевода нет в выбранном языке, показываем русский текст, а не ключ вида "account.security.title"
  fallbackLocale: 'ru'
}))
